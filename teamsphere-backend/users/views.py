from django.contrib.auth import get_user_model
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .permissions import IsAdminOrManager
from .serializers import UserListSerializer

User = get_user_model()
VALID_ROLES = {choice[0] for choice in User.ROLE_CHOICES}


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all().order_by('email')
    serializer_class = UserListSerializer

    def get_permissions(self):
        if self.action in ('list', 'partial_update', 'update'):
            return [IsAuthenticated(), IsAdminOrManager()]
        return [IsAuthenticated()]

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        role = request.data.get('role')
        if role is None:
            return Response({'role': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if role not in VALID_ROLES:
            return Response({'role': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save(update_fields=['role'])
        return Response(UserListSerializer(user).data)

    def update(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

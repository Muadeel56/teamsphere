from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsAdminOrManager

from .models import Team
from .serializers import TeamSerializer

User = get_user_model()
VALID_ROLES = {choice[0] for choice in User.ROLE_CHOICES}


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().prefetch_related('members')
    serializer_class = TeamSerializer

    @action(
        detail=True,
        methods=['post'],
        url_path='invite',
        permission_classes=[IsAuthenticated, IsAdminOrManager],
    )
    def invite(self, request, pk=None):
        team = self.get_object()
        email = (request.data.get('email') or '').strip().lower()
        role = request.data.get('role', 'member')

        if not email:
            return Response({'email': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if role not in VALID_ROLES:
            return Response({'role': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'No user found with that email address.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if team.members.filter(pk=user.pk).exists():
            return Response(
                {'detail': 'This user is already a member of the team.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.role != role:
            user.role = role
            user.save(update_fields=['role'])

        team.members.add(user)
        serializer = self.get_serializer(team)
        return Response(serializer.data, status=status.HTTP_200_OK)

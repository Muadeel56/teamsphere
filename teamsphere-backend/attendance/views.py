from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('user').all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        qs = Attendance.objects.select_related('user').all()

        date_param = self.request.query_params.get('date')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if date_param:
            qs = qs.filter(date=date_param)
        else:
            if start_date:
                qs = qs.filter(date__gte=start_date)
            if end_date:
                qs = qs.filter(date__lte=end_date)

        return qs.order_by('-date', '-check_in')

    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        today = timezone.localdate()
        now = timezone.now()

        open_session = Attendance.objects.filter(
            user=request.user,
            date=today,
            check_out__isnull=True,
        ).first()

        if open_session:
            return Response(
                {'detail': 'Already checked in.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record = Attendance.objects.create(
            user=request.user,
            date=today,
            check_in=now,
        )
        serializer = self.get_serializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='check-out')
    def check_out(self, request):
        today = timezone.localdate()
        now = timezone.now()

        open_session = Attendance.objects.filter(
            user=request.user,
            date=today,
            check_out__isnull=True,
        ).first()

        if not open_session:
            return Response(
                {'detail': 'No active check-in found.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        open_session.check_out = now
        open_session.save(update_fields=['check_out'])
        serializer = self.get_serializer(open_session)
        return Response(serializer.data)

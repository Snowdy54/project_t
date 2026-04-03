from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Point
from .serializers import PointSerializer

class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend]
    # Позволяем фильтровать по ID типов отходов
    filterset_fields = ['accepted_waste']
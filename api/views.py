from rest_framework import viewsets, permissions as drf_permissions, exceptions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Point, PointWastePrice
from .serializers import PointSerializer, PointWastePriceSerializer
from .permissions import IsPointOwner
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserProfileSerializer

class UserProfileView(APIView):
    permission_classes = [drf_permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['accepted_waste', 'owner'] # Чтобы можно было найти все точки одного владельца

class PointWastePriceViewSet(viewsets.ModelViewSet):
    queryset = PointWastePrice.objects.all()
    serializer_class = PointWastePriceSerializer
    permission_classes = [drf_permissions.IsAuthenticatedOrReadOnly, IsPointOwner]
    
    # Добавляем возможность фильтрации: /api/prices/?point=1
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['point']

    def perform_create(self, serializer):
        # Дополнительная проверка: принадлежит ли точка юзеру?
        point = serializer.validated_data.get('point')
        if point.owner != self.request.user:
            raise exceptions.PermissionDenied("Вы не можете устанавливать цены для чужого пункта.")
        serializer.save()
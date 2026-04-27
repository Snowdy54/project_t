from rest_framework import viewsets, exceptions, generics, status
from rest_framework import permissions as drf_permissions # Ты импортировал как drf_permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated # Добавь прямой импорт сюда
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from .models import Review, Notification
from .serializers import ReviewSerializer, NotificationSerializer


from .models import Point, PointWastePrice
from .serializers import (
    PointSerializer, 
    PointWastePriceSerializer, 
    UserProfileSerializer, 
    RegisterSerializer, 
    ChangePasswordSerializer,
    User
)
from .permissions import IsPointOwner


class UserProfileView(APIView):
    permission_classes = [drf_permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['owner'] # Чтобы можно было найти все точки одного владельца

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

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # К этой "двери" доступ есть у всех, даже без токена
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Пароль успешно изменен"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Автоматически привязываем текущего юзера как автора отзыва
        serializer.save(user=self.request.user)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Только для чтения и обновления статуса is_read"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Юзер видит только свои уведомления
        return Notification.objects.filter(user=self.request.user).order_set('-created_at')
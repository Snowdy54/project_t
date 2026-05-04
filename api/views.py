from rest_framework import viewsets, exceptions, generics, status
from rest_framework import permissions as drf_permissions # Ты импортировал как drf_permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated # Добавь прямой импорт сюда
from django_filters.rest_framework import DjangoFilterBackend
from .models import Point, PointWastePrice
from .serializers import (
    PointSerializer, 
    PointWastePriceSerializer, 
    UserProfileSerializer, 
    RegisterSerializer, 
    ChangePasswordSerializer,
    User
)

from .serializers import (
    PointSerializer, 
    ReviewSerializer, 
    RegisterSerializer, 
    UserProfileSerializer,
    ChangePasswordSerializer
)

from .permissions import IsPointOwner
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import PointReaction, Review, PointEditSuggestion


class UserProfileView(APIView):
    permission_classes = [drf_permissions.IsAuthenticated]
    
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("ОШИБКА СОХРАНЕНИЯ ПРОФИЛЯ:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PointViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.action == 'list':
            return Point.objects.filter(status='approved')
        return Point.objects.all()
    
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['owner'] # Чтобы можно было найти все точки одного владельца
    
    def perform_create(self, serializer):
        # Автоматически прописываем текущего пользователя как владельца точки
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'])
    def reaction(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"error": "Необходима авторизация"}, status=status.HTTP_401_UNAUTHORIZED)

        point = self.get_object()
        reaction_type = request.data.get('reaction') # Получаем 'like' или 'dislike' из React

        if reaction_type not in ['like', 'dislike']:
            return Response({"error": "Неверный тип реакции"}, status=status.HTTP_400_BAD_REQUEST)

        is_like = (reaction_type == 'like')
        
        # Ищем, ставил ли юзер уже реакцию. Если нет - создаем.
        reaction, created = PointReaction.objects.get_or_create(
            user=request.user, 
            point=point,
            defaults={'is_like': is_like}
        )

        if not created:
            if reaction.is_like == is_like:
                # Нажал второй раз на ту же кнопку -> удаляем реакцию (снимаем лайк)
                reaction.delete()
            else:
                # Передумал (поменял лайк на дизлайк)
                reaction.is_like = is_like
                reaction.save()

        return Response({"message": "Реакция обновлена"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"error": "Необходима авторизация"}, status=status.HTTP_401_UNAUTHORIZED)
        
        point = self.get_object()
        text = request.data.get('text', '')
        rating = request.data.get('rating', 5) # По умолчанию ставим 5 звезд

        if not text.strip():
            return Response({"error": "Текст отзыва не может быть пустым"}, status=status.HTTP_400_BAD_REQUEST)

        # Создаем комментарий в базе
        review = Review.objects.create(
            point=point,
            user=request.user,
            rating=rating,
            text=text
        )
        
        # Сериализуем его, чтобы вернуть обратно на фронтенд (для мгновенного отображения)
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def suggest_edit(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"error": "Необходима авторизация"}, status=status.HTTP_401_UNAUTHORIZED)
        
        point = self.get_object()
        text = request.data.get('text', '')

        if not text.strip():
            return Response({"error": "Текст не может быть пустым"}, status=status.HTTP_400_BAD_REQUEST)

        # Сохраняем исправление в базу
        PointEditSuggestion.objects.create(
            point=point,
            user=request.user,
            text=text
        )
        
        return Response({"message": "Исправление успешно отправлено"}, status=status.HTTP_201_CREATED)

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
    
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete() # Удаляет пользователя и все связанные с ним данные каскадно
        return Response({"message": "Аккаунт успешно удален"}, status=status.HTTP_204_NO_CONTENT)
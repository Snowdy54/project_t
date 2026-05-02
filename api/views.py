from rest_framework import viewsets, exceptions, generics, status
from rest_framework import permissions as drf_permissions # Ты импортировал как drf_permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated # Добавь прямой импорт сюда
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, mixins
from django.db.models import F
from .models import Review, Notification, Article, ArticleCategory
from .serializers import ReviewSerializer, NotificationSerializer, ArticleListSerializer, ArticleDetailSerializer, ArticleCategorySerializer


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


class UserProfileViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    @action(detail=False, methods=['post'])
    def request_author_status(self, request):
        user = request.user
        return Response({"detail": "Заявка отправлена."}, status=status.HTTP_200_OK)

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
    

class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author'] # Фильтр по категории и автору
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['created_at', 'views_count']

    def perform_create(self, serializer):
        # Если юзер - админ, он может сразу публиковать. 
        # Если нет - принудительно ставим 'pending'
        if self.request.user.is_staff:
            serializer.save(author=self.request.user)
        else:
            serializer.save(author=self.request.user, status='pending')

    def get_queryset(self):
        user = self.request.user
        # 1. Админы видят всё
        if user.is_staff:
            return Article.objects.all()
        
        # 2. Анонимы видят только опубликованное
        if user.is_anonymous:
            return Article.objects.filter(status='published')

        # 3. Авторы видят опубликованное + свои черновики/статьи на модерации
        return Article.objects.filter(
            models.Q(status='published') | models.Q(author=user)
        ).distinct()

    def get_serializer_class(self):
        # Для списка используем легкий сериализатор, для деталки - полный
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Атомарно увеличиваем счетчик просмотров
        Article.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        
        # Обновляем instance, чтобы вернуть актуальное число в ответе
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # Кастомный эндпоинт для "Архива" (/api/articles/archive/)
    @action(detail=False, methods=['get'])
    def archive(self, request):
        archived_articles = Article.objects.filter(status='archived').select_related('category', 'author')
        page = self.paginate_queryset(archived_articles)
        if page is not None:
            serializer = ArticleListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ArticleListSerializer(archived_articles, many=True)
        return Response(serializer.data)
        
    # Кастомный эндпоинт для "Популярного" (/api/articles/popular/)
    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_articles = self.get_queryset().order_by('-views_count')[:10] # Топ-10
        serializer = ArticleListSerializer(popular_articles, many=True)
        return Response(serializer.data)
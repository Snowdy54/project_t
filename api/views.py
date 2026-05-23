from rest_framework import viewsets, status, filters, mixins, generics, exceptions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F, Q
from django.utils import timezone

from .models import (
    Point, PointWastePrice, Review, Notification, 
    Article, ArticleCategory, User, PointReaction, PointEditSuggestion
)
from .serializers import (
    PointSerializer, PointWastePriceSerializer, ReviewSerializer, 
    NotificationSerializer, ArticleListSerializer, ArticleDetailSerializer, 
    ArticleCategorySerializer, UserProfileSerializer, RegisterSerializer, 
    ChangePasswordSerializer
)
from .permissions import IsPointOwner

# --- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ---

# --- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ---

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
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

# --- ТОЧКИ ПРИЕМА ---

# --- ТОЧКИ ПРИЕМА ---

class PointViewSet(viewsets.ModelViewSet):
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner', 'status']
    search_fields = ['name', 'address']

    def get_queryset(self):
        queryset = Point.objects.all()
        
        if self.action == 'list':
            queryset = queryset.filter(status='approved')

        # 1. ФИЛЬТР ПО ЦЕНЕ
        price_type = self.request.query_params.get('price_type')
        if price_type == 'free':
            queryset = queryset.filter(Q(prices__price_per_kg=0) | Q(prices__isnull=True)).distinct()
        elif price_type == 'paid':
            queryset = queryset.filter(prices__price_per_kg__gt=0).distinct()

        # 2. ФИЛЬТР ПО ВРЕМЕНИ РАБОТЫ
        time_type = self.request.query_params.get('time_type')
        if time_type == '24/7':
            # Поиск по строке "Круглосуточно" в JSON/Text поле
            queryset = queryset.filter(working_hours__icontains='Круглосуточно')
        elif time_type == 'open_now':
            # Примечание: полноценная логика "Сейчас открыто" требует сложных временных вычислений на сервере.
            # Для текущей архитектуры (текстовое расписание) фронтенд сам может фильтровать этот параметр, 
            # или мы возвращаем все одобренные точки, позволяя UI-логике скрыть закрытые.
            pass

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def reaction(self, request, pk=None):
        point = self.get_object()
        reaction_type = request.data.get('reaction') # 'like' или 'dislike'

        if reaction_type not in ['like', 'dislike']:
            return Response({"error": "Неверный тип реакции"}, status=status.HTTP_400_BAD_REQUEST)

        is_like = (reaction_type == 'like')
        reaction, created = PointReaction.objects.get_or_create(
            user=request.user, 
            point=point,
            defaults={'is_like': is_like}
        )

        if not created:
            if reaction.is_like == is_like:
                reaction.delete() # Повторный клик — удаление
            else:
                reaction.is_like = is_like # Смена типа
                reaction.save()

        return Response({"message": "Реакция обновлена"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        point = self.get_object()
        text = request.data.get('text', '').strip()
        rating = request.data.get('rating', 5)

        if not text:
            return Response({"error": "Текст не может быть пустым"}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            point=point, user=request.user, rating=rating, text=text
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def suggest_edit(self, request, pk=None):
        point = self.get_object()
        text = request.data.get('text', '').strip()

        if not text:
            return Response({"error": "Опишите ошибку"}, status=status.HTTP_400_BAD_REQUEST)

        PointEditSuggestion.objects.create(point=point, user=request.user, text=text)
        return Response({"message": "Спасибо! Мы проверим информацию."}, status=status.HTTP_201_CREATED)

# --- ЦЕНЫ И ОТХОДЫ ---

class PointWastePriceViewSet(viewsets.ModelViewSet):
    queryset = PointWastePrice.objects.all()
    serializer_class = PointWastePriceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsPointOwner]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['point']

    def perform_create(self, serializer):
        point = serializer.validated_data.get('point')
        if point.owner != self.request.user:
            raise exceptions.PermissionDenied("Вы не владелец этой точки.")
        serializer.save()

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # Добавили waste_types в фильтры! Теперь фронт может делать: /api/articles/?waste_types=1
    filterset_fields = ['category', 'status', 'waste_types'] 
    search_fields = ['title', 'summary']
    ordering_fields = ['views_count', 'published_at'] # Разрешаем сортировку по этим полям

    def get_queryset(self):
        user = self.request.user
        
        # Находим статьи, опубликованные более 14 дней назад, и отправляем в архив
        two_weeks_ago = timezone.now() - timezone.timedelta(days=14)
        Article.objects.filter(
            status='published', 
            published_at__lt=two_weeks_ago
        ).update(status='archived')

        if user.is_authenticated and user.is_staff:
            return Article.objects.all()
        if user.is_anonymous:
            return Article.objects.filter(status='published')
        return Article.objects.filter(Q(status='published') | Q(author=user)).distinct()

    def get_serializer_class(self):
        return ArticleListSerializer if self.action == 'list' else ArticleDetailSerializer

    def perform_create(self, serializer):
        # Если статью создает админ - сразу публикуем
        if self.request.user.is_staff:
            serializer.save(author=self.request.user, status='published', published_at=timezone.now())
        # Если обычный автор - отправляем на модерацию
        else:
            serializer.save(author=self.request.user, status='pending')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Article.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        return Response(self.get_serializer(instance).data)

class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer

# --- СЕРВИСНЫЕ ВЬЮ (АККАУНТ) ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
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
            return Response({"message": "Пароль изменен"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        request.user.delete()
        return Response({"message": "Аккаунт удален"}, status=status.HTTP_204_NO_CONTENT)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
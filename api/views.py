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

class PointViewSet(viewsets.ModelViewSet):
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner', 'status']
    search_fields = ['name', 'address']

    def get_queryset(self):
        if self.action == 'list':
            return Point.objects.filter(status='approved')
        return Point.objects.all()
    
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

# --- СТАТЬИ И КАТЕГОРИИ ---

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'summary']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return Article.objects.all()
        if user.is_anonymous:
            return Article.objects.filter(status='published')
        return Article.objects.filter(Q(status='published') | Q(author=user)).distinct()

    def get_serializer_class(self):
        return ArticleListSerializer if self.action == 'list' else ArticleDetailSerializer

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
from rest_framework import viewsets, exceptions, generics, status, filters, mixins
from rest_framework import permissions as drf_permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.db.models import F, Q
from .models import (
    Point, PointWastePrice, Review, Notification, 
    Article, ArticleCategory, User
)
from .serializers import (
    PointSerializer, PointWastePriceSerializer, ReviewSerializer, 
    NotificationSerializer, ArticleListSerializer, ArticleDetailSerializer, 
    ArticleCategorySerializer, UserProfileSerializer, RegisterSerializer, 
    ChangePasswordSerializer
)
from .permissions import IsPointOwner

class UserProfileViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        if self.kwargs.get('pk') == 'me':
            return self.request.user
        return super().get_object()

class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # Исправлено: убран accepted_waste, так как по нему нельзя фильтровать напрямую
    filterset_fields = ['owner', 'status']
    search_fields = ['name', 'address']

class PointWastePriceViewSet(viewsets.ModelViewSet):
    queryset = PointWastePrice.objects.all()
    serializer_class = PointWastePriceSerializer
    permission_classes = [drf_permissions.IsAuthenticatedOrReadOnly, IsPointOwner]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['point']

    def perform_create(self, serializer):
        point = serializer.validated_data.get('point')
        if point.owner != self.request.user:
            raise exceptions.PermissionDenied("Вы не являетесь владельцем точки.")
        serializer.save()

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [drf_permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']

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

# Остальные вьюсеты (ArticleCategoryViewSet, ReviewViewSet, ChangePasswordView) оставляем без изменений
class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [drf_permissions.IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
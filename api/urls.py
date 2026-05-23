from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView, ChangePasswordView, UserProfileView, DeleteAccountView,
    PointViewSet, PointWastePriceViewSet, ReviewViewSet, 
    NotificationViewSet, ArticleViewSet, ArticleCategoryViewSet
)

router = DefaultRouter()
router.register(r'points', PointViewSet, basename='point')
router.register(r'prices', PointWastePriceViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'categories', ArticleCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
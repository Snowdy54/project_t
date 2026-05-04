from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ChangePasswordView, UserProfileViewSet, DeleteAccountView,
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
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
]
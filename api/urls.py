from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (ChangePasswordView, PointViewSet, PointWastePriceViewSet,
                     RegisterView, UserProfileView,
                       ArticleViewSet, ArticleCategoryViewSet)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'points', PointViewSet)
router.register(r'point-prices', PointWastePriceViewSet)
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'article-categories', ArticleCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
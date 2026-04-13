from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PointViewSet, PointWastePriceViewSet, RegisterView, UserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'points', PointViewSet)
router.register(r'point-prices', PointWastePriceViewSet)

urlpatterns = [
    # Наш профиль
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    # Все пути из роутера (api/points/ и api/point-prices/)
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),    
]
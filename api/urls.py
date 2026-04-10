from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PointViewSet, PointWastePriceViewSet, UserProfileView

router = DefaultRouter()
router.register(r'points', PointViewSet)
router.register(r'point-prices', PointWastePriceViewSet)

urlpatterns = [
    # Наш профиль
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Все пути из роутера (api/points/ и api/point-prices/)
    path('', include(router.urls)),
]
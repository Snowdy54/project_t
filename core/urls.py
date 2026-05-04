from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import (ChangePasswordView, 
                       PointViewSet, 
                       PointWastePriceViewSet, 
                       RegisterView, 
                       UserProfileView, 
                       DeleteAccountView)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Все основные пути API лежат в api/urls.py
    path('api/', include('api.urls')),
    
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')), 
    
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
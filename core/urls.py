from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Говорим Django: "Все запросы, начинающиеся с api/, перенаправляй в файл api.urls"
    path('api/', include('api.urls')), 
]
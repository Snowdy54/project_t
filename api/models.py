from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser
from geopy.geocoders import Yandex
from django.contrib.gis.geos import Point as GEOSPoint

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name="Аватар")

    def __str__(self):
        return self.username

class WasteType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название (например, ПЭТ 01)")
    description = models.TextField(verbose_name="Инструкция по подготовке", blank=True)

    def __str__(self):
        return self.name

class Point(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    
    location = models.PointField(verbose_name="Координаты (локация)", null=True, blank=True, srid=4326)
    latitude = models.FloatField(verbose_name="Широта", blank=True, null=True)
    longitude = models.FloatField(verbose_name="Долгота", blank=True, null=True)
    
    description = models.TextField(verbose_name="Описание", blank=True, null=True)
    phone = models.CharField(max_length=20, verbose_name="Телефон", blank=True, null=True)
    working_hours = models.JSONField(verbose_name="Режим работы", blank=True, null=True, default=dict)

    status = models.CharField(
        max_length=10, 
        choices=[('pending', 'На модерации'), ('approved', 'Одобрено'), ('rejected', 'Отклонено')],
        default='pending', 
        verbose_name='Статус'
    )

    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='points')
    inn = models.CharField(max_length=12, null=True, blank=True, verbose_name='ИНН')
    legal_entity = models.CharField(max_length=255, null=True, blank=True, verbose_name='ИП / ООО')

    def save(self, *args, **kwargs):
        if not self.latitude or not self.longitude:
            try:
                geolocator = Yandex(api_key='b3a0ce03-2358-422e-90a5-4ab3331d93c6')
                location_data = geolocator.geocode(self.address)
                if location_data:
                    self.latitude = location_data.latitude
                    self.longitude = location_data.longitude
            except Exception as e:
                print(f"Ошибка геокодирования: {e}")
        
        if self.latitude and self.longitude:
            self.location = GEOSPoint(self.longitude, self.latitude)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class PointWastePrice(models.Model):
    point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name='prices')
    waste_type = models.ForeignKey(WasteType, on_delete=models.CASCADE, verbose_name="Тип отхода")
    item_spec = models.CharField(max_length=255, blank=True, null=True, verbose_name="Уточнение")
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    unit = models.CharField(max_length=20, default="кг", verbose_name="Единица")
    is_available = models.BooleanField(default=True, verbose_name="Принимается сейчас")

    class Meta:
        verbose_name = "Цена на отход"
        verbose_name_plural = "Цены на отходы"
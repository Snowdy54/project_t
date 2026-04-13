from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from core import settings
from geopy.geocoders import Yandex


class User(AbstractUser):
    is_business = models.BooleanField(default=False, verbose_name="Представитель бизнеса")

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
    latitude = models.FloatField(verbose_name="Широта", blank=True, null=True)
    longitude = models.FloatField(verbose_name="Долгота", blank=True, null=True)
    accepted_waste = models.ManyToManyField('WasteType', related_name='points', verbose_name="Принимаемые отходы")

    STATUS_CHOICES = [
        ('pending', 'На модерации'),
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name='Статус'
    )

    # Владелец теперь может быть null (если точку добавил прохожий)
    owner = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='points',
        verbose_name='Владелец бизнеса'
    )

    # Юридические данные (заполняются только если человек претендует на точку)
    inn = models.CharField(max_length=12, null=True, blank=True, verbose_name='ИНН')
    legal_entity = models.CharField(max_length=255, null=True, blank=True, verbose_name='ИП / ООО')

    def save(self, *args, **kwargs):
        if not self.latitude or not self.longitude:
            try:
                geolocator = Yandex(api_key='b3a0ce03-2358-422e-90a5-4ab3331d93c6')
                location = geolocator.geocode(self.address)
                if location:
                    self.latitude = location.latitude
                    self.longitude = location.longitude
            except Exception as e:
                print(f"Ошибка геокодирования: {e}")
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PointWastePrice(models.Model):
    point = models.ForeignKey(
        'Point', 
        on_delete=models.CASCADE, 
        related_name='prices'
    )
    waste_type = models.ForeignKey(
        'WasteType', 
        on_delete=models.CASCADE
    )
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        # Чтобы нельзя было создать две разные цены для одного и того же типа отхода в одном пункте
        unique_together = ('point', 'waste_type')

    def __str__(self):
        return f"{self.point.name} — {self.waste_type.name}: {self.price_per_kg} руб."
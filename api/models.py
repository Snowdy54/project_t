from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from geopy.geocoders import Yandex

# 1. Модель Пользователя (User)
class User(AbstractUser):
    # Добавляем флаг, чтобы понимать: это обычный юзер или владелец пункта
    is_business = models.BooleanField(default=False, verbose_name="Представитель бизнеса")

    def __str__(self):
        return self.username

# 2. Модель Типа Отходов (WasteType)
class WasteType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название (например, ПЭТ 01)")
    description = models.TextField(verbose_name="Инструкция по подготовке", blank=True)

    def __str__(self):
        return self.name

# 3. Модель Пункта Приема (Point)
class Point(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    latitude = models.FloatField(verbose_name="Широта", blank=True, null=True)
    longitude = models.FloatField(verbose_name="Долгота", blank=True, null=True)
    accepted_waste = models.ManyToManyField('WasteType', related_name='points', verbose_name="Принимаемые отходы")

    def save(self, *args, **kwargs):
        # Если координаты не заполнены вручную, пробуем их найти по адресу
        if not self.latitude or not self.longitude:
            try:
                # Вставь сюда свой API ключ от Яндекса
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
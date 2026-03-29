from django.db import models
from django.contrib.auth.models import AbstractUser

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
    name = models.CharField(max_length=255, verbose_name="Название пункта")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    
    # Пока используем простые координаты. 
    # Позже, когда будем подключать PostgreSQL + PostGIS, заменим на PointField [cite: 4]
    latitude = models.FloatField(verbose_name="Широта")
    longitude = models.FloatField(verbose_name="Долгота")
    
    # Связь "Многие-ко-многим": один пункт принимает много типов отходов
    accepted_waste = models.ManyToManyField(WasteType, related_name='points', verbose_name="Принимаемые отходы")
    
    # Связь "Один-ко-многим": у пункта есть владелец (бизнес-аккаунт)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_points', null=True, blank=True)

    def __str__(self):
        return self.name
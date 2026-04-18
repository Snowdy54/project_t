from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from core import settings
from geopy.geocoders import Yandex


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
    latitude = models.FloatField(verbose_name="Широта", blank=True, null=True)
    longitude = models.FloatField(verbose_name="Долгота", blank=True, null=True)
    accepted_waste = models.ManyToManyField('WasteType', related_name='points', verbose_name="Принимаемые отходы")
    description = models.TextField(verbose_name="Описание (общая информация)", blank=True, null=True)
    phone = models.CharField(max_length=20, verbose_name="Телефон для связи", blank=True, null=True)
    
    working_hours = models.JSONField(
        verbose_name="Режим работы (по дням)",
        blank=True,
        null=True,
        default=dict,
        help_text="Пример: {'пн': '08:00-20:00', 'сб': '10:00-15:00', 'вс': 'выходной'}"
    )

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
    point = models.ForeignKey('Point', on_delete=models.CASCADE, related_name='prices')
    waste_type = models.ForeignKey('WasteType', on_delete=models.CASCADE, verbose_name="Тип отхода")
    
    item_spec = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        verbose_name="Уточнение (например, 'Ящики из-под фруктов' или 'Пленка')"
    )
    
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за ед. (руб.)")
    unit = models.CharField(max_length=20, default="кг", verbose_name="Единица измерения")
    is_available = models.BooleanField(default=True, verbose_name="Принимается сейчас")

    class Meta:
        # Убираем unique_together, если хотим разрешить разные цены на разные предметы одного типа (пластик-ящик и пластик-бутылка)
        verbose_name = "Цена на отход"
        verbose_name_plural = "Цены на отходы"

    def __str__(self):
        return f"{self.waste_type.name} ({self.item_spec or 'общий'}) — {self.price_per_kg} руб/{self.unit}"
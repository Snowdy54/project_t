from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser
from geopy.geocoders import Yandex
from django.contrib.gis.geos import Point as GEOSPoint

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name="Аватар")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Город")
    email = models.CharField(max_length=30, blank=True, null=True, verbose_name="Почта")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    about = models.TextField(blank=True, null=True, verbose_name="О себе")
    is_author = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return self.username

class WasteType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название (например, Ящик для фруктов (б/у))")
    description = models.TextField(verbose_name="Тип отходов/сырья", blank=True)

    class Meta:
        verbose_name = "Наименование отхода"
        verbose_name_plural = "Отходы/Сырье"

    def __str__(self):
        if self.description:
            return f"{self.name} ({self.description})"
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
    site = models.CharField(max_length=255, verbose_name="Сайт", blank=True, null=True)
    useful_links = models.TextField(verbose_name="Полезные ссылки", blank=True, null=True)

    status = models.CharField(
        max_length=10, 
        choices=[('pending', 'На модерации'), ('approved', 'Одобрено'), ('rejected', 'Отклонено')],
        default='pending', 
        verbose_name='Статус'
    )

    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='points', verbose_name="Владелец")
    inn = models.CharField(max_length=12, null=True, blank=True, verbose_name='ИНН')
    legal_entity = models.CharField(max_length=255, null=True, blank=True, verbose_name='ИП / ООО')

    class Meta:
        verbose_name = "Точка приема"
        verbose_name_plural = "Точки приема"

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
    point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name='prices', verbose_name="Точка")
    waste_type = models.ForeignKey(WasteType, on_delete=models.CASCADE, verbose_name="Тип отхода")
    item_spec = models.CharField(max_length=255, blank=True, null=True, verbose_name="Уточнение")
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    unit = models.CharField(max_length=20, default="кг", verbose_name="Единица")
    is_available = models.BooleanField(default=True, verbose_name="Принимается сейчас")

    class Meta:
        verbose_name = "Цена на отход"
        verbose_name_plural = "Цены на отходы"

class Review(models.Model):
    point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name='reviews', verbose_name="Точка")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', verbose_name="Автор")
    rating = models.PositiveSmallIntegerField(verbose_name="Оценка (1-5)")
    text = models.TextField(verbose_name="Текст отзыва", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', verbose_name="Пользователь")
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    message = models.TextField(verbose_name="Сообщение")
    is_read = models.BooleanField(default=False, verbose_name="Прочитано")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
        
class PointReaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name='reactions', verbose_name="Точка")
    is_like = models.BooleanField(verbose_name="Это лайк?") # True = лайк, False = дизлайк

    class Meta:
        verbose_name = "Реакция на пункт"
        verbose_name_plural = "Реакции на пункты"
        # Защита: один пользователь может оставить только одну реакцию на один пункт
        unique_together = ('user', 'point') 

    def __str__(self):
        reaction = "Лайк" if self.is_like else "Дизлайк"
        return f"{self.user.username} -> {self.point.name} ({reaction})"
    
class PointEditSuggestion(models.Model):
    point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name='edit_suggestions', verbose_name="Точка")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Пользователь")
    text = models.TextField(verbose_name="Текст исправления")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата отправки")
    is_resolved = models.BooleanField(default=False, verbose_name="Рассмотрено")

    class Meta:
        verbose_name = "Исправления"
        verbose_name_plural = "Исправления"

    def __str__(self):
        username = self.user.username if self.user else "Аноним"
        return f"Исправление для '{self.point.name}' от {username}"
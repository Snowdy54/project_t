from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils import timezone
from .models import (
    User, Point, WasteType, PointWastePrice, 
    Review, Notification, Article, ArticleCategory, PointEditSuggestion
)

# 1. Безопасная перерегистрация User
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'city', 'is_author', 'is_staff')
    list_filter = ('is_author', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Профиль', {'fields': ('city', 'phone', 'about', 'avatar', 'is_author')}),
    )

class PointWastePriceInline(admin.TabularInline):
    model = PointWastePrice
    extra = 1

@admin.register(Point)
class PointAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'status', 'owner', 'get_categories')
    list_filter = ('status',) 
    search_fields = ('name', 'address')
    inlines = [PointWastePriceInline]
    fieldsets = (
        ("Основная информация", {'fields': ('name', 'address', 'status', 'owner')}),
        ("Контакты и описание", {'fields': ('description', 'phone','site', 'useful_links', 'working_hours')}),
        ("Геоданные", {'fields': ('latitude', 'longitude')}),
        ("Юридическая информация", {'fields': ('inn', 'legal_entity'), 'classes': ('collapse',)}),
    )

    @admin.display(description='Принимаемое сырье')
    def get_categories(self, obj):
        return ", ".join([p.waste_type.name for p in obj.prices.all()])

@admin.register(WasteType)
class WasteTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('point', 'user', 'rating', 'created_at')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')

@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'views_count')
    def save_model(self, request, obj, form, change):
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)

@admin.register(PointEditSuggestion)
class PointEditSuggestionAdmin(admin.ModelAdmin):
    list_display = ('point', 'user', 'created_at', 'is_resolved')
    list_filter = ('is_resolved',)
    readonly_fields = ('point', 'user', 'text', 'created_at')
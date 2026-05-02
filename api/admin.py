from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils import timezone
from .models import (
    User, Point, WasteType, PointWastePrice, 
    Review, Notification, Article, ArticleCategory
)

# Если в логах была ошибка AlreadyRegistered, 
# значит Django уже зарегистрировал User через другой файл или системно.
# Для надежности можно сначала сделать unregister, если это необходимо.


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_author', 'is_staff', 'is_active')
    list_filter = ('is_author', 'is_staff', 'is_active')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительная информация', {'fields': ('avatar', 'is_author')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Дополнительная информация', {'fields': ('avatar', 'is_author')}),
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
    
    @admin.display(description='Принимаемое сырье')
    def get_categories(self, obj):
        return ", ".join([p.waste_type.name for p in obj.prices.all()])

@admin.register(WasteType)
class WasteTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(PointWastePrice)
class PointWastePriceAdmin(admin.ModelAdmin):
    list_display = ('point', 'waste_type', 'price_per_kg', 'is_available')

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
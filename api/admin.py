from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PointWastePrice, User, WasteType, Point, Review, Notification, Article, ArticleCategory
from django.utils import timezone
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class PointWastePriceInline(admin.TabularInline):
    model = PointWastePrice
    extra = 1
    fields = ('waste_type', 'item_spec', 'price_per_kg', 'unit', 'is_available')

@admin.register(Point)
class PointAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'status', 'owner', 'get_categories')
    list_filter = ('status', 'prices__waste_type') 
    search_fields = ('name', 'address')
    
    inlines = [PointWastePriceInline]
    
    fieldsets = (
        (" Основная информация", {
            'fields': ('name', 'address', 'status', 'owner')
        }),
        (" Контакты и описание", {
            'fields': ('description', 'phone', 'working_hours'),
        }),
        (" Геоданные", {
            'fields': ('latitude', 'longitude'),
        }),
        (" Юридическая информация", {
            'fields': ('inn', 'legal_entity'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Принимаемое сырье')
    def get_categories(self, obj):
        # Добавляем select_related в queryset, чтобы не было тормозов (N+1 запрос)
        prices = obj.prices.select_related('waste_type').all()
        return ", ".join([p.waste_type.name for p in prices])

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('point', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('text', 'user__username', 'point__name')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')

# Регистрируем пользователя с его стандартной админкой
admin.site.register(User, UserAdmin)
admin.site.register(WasteType)

@admin.register(PointWastePrice)
class PointWastePriceAdmin(admin.ModelAdmin):
    list_display = ('point', 'waste_type', 'item_spec', 'price_per_kg', 'is_available')
    list_filter = ('waste_type', 'point', 'is_available')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Добавляем наши поля в интерфейс админки
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('avatar', 'is_author')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'fields': ('avatar', 'is_author')}),
    )


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)} # Автозаполнение слага из названия

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'views_count', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'content')
    raw_id_fields = ('author',) # Удобный поиск автора, если юзеров станет много
    date_hierarchy = 'created_at'
    
    # Чтобы дата публикации ставилась автоматически при смене статуса на "Опубликовано"
    def save_model(self, request, obj, form, change):
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)

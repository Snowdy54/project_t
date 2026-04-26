from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PointWastePrice, User, WasteType, Point, Review, Notification

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
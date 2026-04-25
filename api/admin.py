from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PointWastePrice, User, WasteType, Point

class PointWastePriceInline(admin.TabularInline):
    model = PointWastePrice
    extra = 1
    fields = ('waste_type', 'item_spec', 'price_per_kg', 'unit', 'is_available')

@admin.register(Point)
class PointAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'status', 'owner')
    list_filter = ('status', 'accepted_waste')
    search_fields = ('name', 'address')
    
    inlines = [PointWastePriceInline]
    
    fieldsets = (
        ("Основная информация", {
            'fields': ('name', 'address', 'status', 'owner')
        }),
        ("Контакты и описание", {
            'fields': ('description', 'phone', 'working_hours'),
            'description': "Здесь заполняются данные, которые будут выведены в карточку точки."
        }),
        ("Геоданные", {
            'fields': ('latitude', 'longitude'),
            'description': "Координаты определятся автоматически при сохранении по адресу."
        }),
        ("Юридическая информация", {
            'fields': ('inn', 'legal_entity'),
            'classes': ('collapse',),
        }),
        ("Типы отходов", {
            'fields': ('accepted_waste',),
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(WasteType)

# PointWastePrice отдельно регистрировать не обязательно, 
# так как мы редактируем их внутри Point, но можно оставить для быстрого поиска
@admin.register(PointWastePrice)
class PointWastePriceAdmin(admin.ModelAdmin):
    list_display = ('point', 'waste_type', 'item_spec', 'price_per_kg')
    list_filter = ('waste_type', 'point')
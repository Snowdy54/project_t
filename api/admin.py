from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PointWastePrice, User, WasteType, Point

admin.site.register(User, UserAdmin)
admin.site.register(WasteType)
admin.site.register(Point)
admin.site.register(PointWastePrice)
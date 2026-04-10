from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Point, PointWastePrice, WasteType

User = get_user_model()

class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = ['id', 'name', 'description']

class PointWastePriceSerializer(serializers.ModelSerializer):
    waste_type_name = serializers.ReadOnlyField(source='waste_type.name')

    class Meta:
        model = PointWastePrice
        fields = ['id', 'waste_type', 'waste_type_name', 'price_per_kg']

class PointSerializer(serializers.ModelSerializer):
    prices = PointWastePriceSerializer(many=True, read_only=True)

    class Meta:
        model = Point
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'prices']

class UserProfileSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)

    class Meta:
        model = User
        # Заменяем 'role' на 'is_business'
        fields = ['id', 'username', 'email', 'is_business', 'points']
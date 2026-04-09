from rest_framework import serializers
from .models import Point, WasteType

class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = ['id', 'name', 'description']

class PointSerializer(serializers.ModelSerializer):
    # Включаем данные о типах отходов прямо в объект пункта
    accepted_waste = WasteTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Point
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'accepted_waste']
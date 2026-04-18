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
        fields = ['id', 'waste_type', 'waste_type_name', 'price_per_kg', 'unit', 'is_available']

class PointSerializer(serializers.ModelSerializer):
    prices = PointWastePriceSerializer(many=True, read_only=True)

    class Meta:
        model = Point
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude', 
            'status', 'inn', 'legal_entity', 'prices',
            'working_hours', 'phone', 'description' 
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'points']


class RegisterSerializer(serializers.ModelSerializer):
    # Пароль только для записи, в ответах API его не будет видно
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        # Метод create_user автоматически зашифрует пароль
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Старый пароль введен неверно.")
        return value
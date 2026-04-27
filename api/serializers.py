from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Point, PointWastePrice, WasteType, Review, Notification  # ДОБАВИЛИ Review и Notification
from django.db.models import Avg

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

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'rating', 'text', 'created_at']

# ПЕРЕМЕСТИЛИ ВЫШЕ, чтобы UserProfileSerializer его видел
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']

class PointSerializer(serializers.ModelSerializer):
    prices = PointWastePriceSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True) 
    average_rating = serializers.SerializerMethodField()
    coords = serializers.SerializerMethodField()
    accepted_waste = serializers.SerializerMethodField()

    class Meta:
        model = Point
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude', 
            'coords', 'status', 'inn', 'legal_entity', 
            'prices', 'accepted_waste', 'reviews', 'average_rating', 
            'working_hours', 'phone', 'description' 
        ]

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_coords(self, obj):
        if obj.location:
            return {"lng": obj.location.x, "lat": obj.location.y}
        return None

    def get_accepted_waste(self, obj):
        wastes = obj.prices.filter(is_available=True).values_list('waste_type__name', flat=True).distinct()
        return [{"name": name} for name in wastes]

class UserProfileSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)
    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'points', 'notifications']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
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
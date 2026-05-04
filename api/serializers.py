from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Avg
from .models import (
    Point, PointWastePrice, WasteType, Review, 
    Notification, Article, ArticleCategory, PointReaction
)

User = get_user_model()

# --- СИСТЕМНЫЕ СЕРИАЛИЗАТОРЫ (АККАУНТ) ---

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
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

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    points = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'avatar', 'city', 
            'phone', 'about', 'is_author', 'points', 'notifications'
        ]
        read_only_fields = ['username', 'email']

# --- СЕРИАЛИЗАТОРЫ ТОЧЕК ---

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

class PointSerializer(serializers.ModelSerializer):
    prices = PointWastePriceSerializer(many=True, required=False)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    coords = serializers.SerializerMethodField()
    accepted_waste = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Point
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude', 'coords', 
            'status', 'prices', 'accepted_waste', 'reviews', 'average_rating', 
            'working_hours', 'phone', 'description', 'site', 'useful_links',
            'likes', 'dislikes', 'user_reaction', 'inn', 'legal_entity'
        ]
        read_only_fields = ['status']

    def create(self, validated_data):
        prices_data = validated_data.pop('prices', [])
        point = Point.objects.create(**validated_data)
        for price in prices_data:
            PointWastePrice.objects.create(point=point, **price)
        return point

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_coords(self, obj):
        return {"lng": obj.location.x, "lat": obj.location.y} if obj.location else None

    def get_accepted_waste(self, obj):
        return [{"name": p.waste_type.name} for p in obj.prices.filter(is_available=True)]

    def get_likes(self, obj): return obj.reactions.filter(is_like=True).count()
    def get_dislikes(self, obj): return obj.reactions.filter(is_like=False).count()
    
    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return 'like' if reaction.is_like else 'dislike'
        return None

# --- СЕРИАЛИЗАТОРЫ СТАТЕЙ ---

class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ['id', 'name', 'slug']

class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    author_name = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'summary', 'cover_image', 
            'category', 'category_name', 'author_name', 
            'views_count', 'created_at'
        ]

class ArticleDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    author_name = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'summary', 'content', 'cover_image', 
            'audio_file', 'category', 'category_name', 'author', 
            'author_name', 'views_count', 'status', 'created_at', 'published_at'
        ]
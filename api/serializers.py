from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, WasteType, Point, PointWastePrice, Review, Notification

User = get_user_model()

class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = ['id', 'name', 'description']

class PointWastePriceSerializer(serializers.ModelSerializer):
    waste_type_name = serializers.ReadOnlyField(source='waste_type.name')
    waste_category = serializers.ReadOnlyField(source='waste_type.description')

    class Meta:
        model = PointWastePrice
        fields = ['id', 'waste_type', 'waste_type_name', 'waste_category', 'price_per_kg', 'unit', 'is_available']

class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='user.username') # Чтобы видеть имя автора
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'rating', 'text', 'created_at']

class PointSerializer(serializers.ModelSerializer):
    prices = PointWastePriceSerializer(many=True, required=False)
    reviews = ReviewSerializer(many=True, read_only=True) # ДОБАВИТЬ ЭТУ СТРОКУ
    coords = serializers.SerializerMethodField()
    accepted_waste = serializers.SerializerMethodField()
    owner_email = serializers.ReadOnlyField(source='owner.email') # Для почты модератора
    
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    useful_links = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Point
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude', 
            'location', 'coords', 'status', 'inn', 'legal_entity', 
            'prices', 'accepted_waste', 'working_hours', 'phone', 
            'description', 'reviews', 'owner_email',
            'likes', 'dislikes', 'user_reaction',
            'site', 'useful_links'
        ]
        
        read_only_fields = ['status']
        
    def create(self, validated_data):
        # 1. Вытаскиваем цены из данных, если они есть
        prices_data = validated_data.pop('prices', [])
        
        # 2. Создаем саму точку (статус 'pending' применится по умолчанию из модели)
        # owner назначается во viewset
        point = Point.objects.create(**validated_data)
        
        # 3. Создаем связанные цены
        for price_data in prices_data:
            # waste_type - это объект WasteType, поэтому берем его ID
            waste_type = price_data.pop('waste_type')
            PointWastePrice.objects.create(point=point, waste_type=waste_type, **price_data)
            
        return point

    def get_coords(self, obj):
        if obj.location:
            return {"lng": obj.location.x, "lat": obj.location.y}
        return None

    def get_accepted_waste(self, obj):
        wastes = obj.prices.filter(is_available=True).values_list('waste_type__description', flat=True).distinct()
        return [{"name": name} for name in wastes if name]
    
    def get_likes(self, obj):
        return obj.reactions.filter(is_like=True).count()

    def get_dislikes(self, obj):
        return obj.reactions.filter(is_like=False).count()

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return 'like' if reaction.is_like else 'dislike'
        return None
    

class UserProfileSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'city', 'phone', 'about', 'points', 'avatar']
        read_only_fields = ['username', 'email']


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
            is_author=False
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
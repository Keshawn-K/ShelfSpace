from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MediaType, Genre, MediaItem, Shelf, ShelfItem, UserProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar', 'bio']


class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class MediaItemSerializer(serializers.ModelSerializer):
    media_type_name = serializers.CharField(source='media_type.name', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)

    class Meta:
        model = MediaItem
        fields = ['id', 'title', 'creator', 'media_type', 'media_type_name', 
                  'genre', 'genre_name', 'year', 'description', 'cover_image', 'created_at']


class ShelfItemSerializer(serializers.ModelSerializer):
    media_item = MediaItemSerializer(read_only=True)
    media_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MediaItem.objects.all(), source='media_item', write_only=True
    )

    class Meta:
        model = ShelfItem
        fields = ['id', 'shelf', 'media_item', 'media_item_id', 'rating', 'review_text', 'added_at']


class ShelfSerializer(serializers.ModelSerializer):
    items = ShelfItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Shelf
        fields = ['id', 'user', 'name', 'is_default', 'item_count', 'items', 'created_at']
        read_only_fields = ['user']
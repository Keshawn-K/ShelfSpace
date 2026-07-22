from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import MediaType, Genre, MediaItem, Shelf, ShelfItem, UserProfile
from .serializers import (
    UserSerializer, UserProfileSerializer, MediaTypeSerializer,
    GenreSerializer, MediaItemSerializer, ShelfSerializer, ShelfItemSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(obj, 'user') and obj.user == request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MediaTypeViewSet(viewsets.ModelViewSet):
    queryset = MediaType.objects.all()
    serializer_class = MediaTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['media_type', 'genre', 'year']
    search_fields = ['title', 'creator', 'description']
    ordering_fields = ['title', 'year', 'created_at']
    ordering = ['-created_at']


class ShelfViewSet(viewsets.ModelViewSet):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Shelf.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        shelf = self.get_object()
        media_item_id = request.data.get('media_item_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text', '')

        try:
            media_item = MediaItem.objects.get(id=media_item_id)
            shelf_item, created = ShelfItem.objects.get_or_create(
                shelf=shelf,
                media_item=media_item,
                defaults={'rating': rating, 'review_text': review_text}
            )
            if not created:
                shelf_item.rating = rating
                shelf_item.review_text = review_text
                shelf_item.save()

            serializer = ShelfItemSerializer(shelf_item)
            return Response(serializer.data)
        except MediaItem.DoesNotExist:
            return Response({'error': 'Media item not found'}, status=404)


class ShelfItemViewSet(viewsets.ModelViewSet):
    queryset = ShelfItem.objects.all()
    serializer_class = ShelfItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return ShelfItem.objects.filter(shelf__user=self.request.user)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, UserProfileViewSet, MediaTypeViewSet,
    GenreViewSet, MediaItemViewSet, ShelfViewSet, ShelfItemViewSet
)
from .auth_views import register

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'media-types', MediaTypeViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'media-items', MediaItemViewSet)
router.register(r'shelves', ShelfViewSet)
router.register(r'shelf-items', ShelfItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
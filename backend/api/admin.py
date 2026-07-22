from django.contrib import admin
from .models import MediaType, Genre, MediaItem, Shelf, ShelfItem, UserProfile

admin.site.register(MediaType)
admin.site.register(Genre)
admin.site.register(MediaItem)
admin.site.register(Shelf)
admin.site.register(ShelfItem)
admin.site.register(UserProfile)
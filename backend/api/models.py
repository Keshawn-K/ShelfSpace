from django.db import models
from django.contrib.auth.models import User


class MediaType(models.Model):
    """Book, Movie, Game, Music, etc."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    """Action, Comedy, Sci-Fi, etc."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class MediaItem(models.Model):
    """The catalog of books, movies, games."""
    title = models.CharField(max_length=200)
    creator = models.CharField(max_length=100, blank=True)  # author, director, artist
    media_type = models.ForeignKey(MediaType, on_delete=models.CASCADE, related_name='items')
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Shelf(models.Model):
    """User's collections: Want to Try, In Progress, Finished."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelves')
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'name']
        verbose_name_plural = 'shelves'

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class ShelfItem(models.Model):
    """Item in a shelf + rating + review."""
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE, related_name='items')
    media_item = models.ForeignKey(MediaItem, on_delete=models.CASCADE, related_name='shelf_entries')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    review_text = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['shelf', 'media_item']

    def __str__(self):
        return f"{self.media_item.title} in {self.shelf.name}"


class UserProfile(models.Model):
    """Extended user info."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

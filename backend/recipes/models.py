from django.db import models
import uuid

from accounts.models import User


class Recipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    preparation_time = models.IntegerField()
    cooking_time = models.IntegerField()
    servings = models.IntegerField()
    ingredients = models.TextField()
    instructions = models.TextField()
    image_url = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_shared = models.BooleanField(default=False)
    rating = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name='liked_recipes', blank=True)

    def __str__(self):
        return f'{self.title} by {self.user}'

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'Recipe'
        verbose_name_plural = 'Recipes'
        
    @staticmethod
    def get_published_recipes(limit=10):
        return Recipe.objects.filter(is_active=True, is_deleted=False, is_published=True).order_by('-created_at')[:limit]
    
    @property
    def average_rating(self):
        return self.rating / self.liked_by.count() if self.liked_by.count() > 0 else 0.00
    
    @property
    def total_likes(self):
        return self.liked_by.count()

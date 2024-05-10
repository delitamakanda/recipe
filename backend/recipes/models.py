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

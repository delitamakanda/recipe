from rest_framework import serializers
from .models import Recipe, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'is_active',)
        read_only_fields = ('id', 'is_staff', 'is_active',)


class RecipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
        fields = ('id', 'user', 'image_url', 'title', 'preparation_time', 'cooking_time', 'servings', 'ingredients', 'instructions',
                  'created_at', 'updated_at', 'is_active', 'is_deleted', 'is_published', 'is_private', 'is_shared', 'average_rating', 'total_likes',
                  'rating', 'liked_by',)
        read_only_fields = ('id', 'created_at', 'updated_at',)

        @staticmethod
        def validate_title(value):
            if len(value) < 3:
                raise serializers.ValidationError('Title must be at least 3 characters long.')
            return value

        @staticmethod
        def validate_preparation_time(self, value):
            if value < 0:
                raise serializers.ValidationError('Preparation time cannot be negative.')
            return value

        @staticmethod
        def validate_cooking_time(self, value):
            if value < 0:
                raise serializers.ValidationError('Cooking time cannot be negative.')
            return value

        @staticmethod
        def validate_servings(self, value):
            if value < 0:
                raise serializers.ValidationError('Servings cannot be negative.')
            return value

        @staticmethod
        def validate_rating(self, value):
            if value < 0 or value > 5:
                raise serializers.ValidationError('Rating must be between 0 and 5.')
            return value


class RecipeListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Recipe
        fields = ('id', 'user', 'image_url', 'average_rating', 'title', 'preparation_time', 'cooking_time', 'servings', 'ingredients', 'instructions', 'total_likes',
                  'created_at', 'updated_at', 'is_active', 'is_deleted', 'is_published', 'is_private', 'is_shared',
                  'rating', 'liked_by',)
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_active', 'is_deleted',
                            'is_published', 'is_private', 'is_shared')


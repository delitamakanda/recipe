from rest_framework import serializers
from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('id', 'user', 'title', 'preparation_time', 'cooking_time', 'servings', 'ingredients', 'instructions',
                  'created_at', 'updated_at', 'is_active', 'is_deleted', 'is_published', 'is_private', 'is_shared',
                  'rating', 'liked_by',)
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_active', 'is_deleted',
                            'is_published', 'is_private', 'is_shared')

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

        def to_representation(self, instance):
            data = super().to_representation(instance)
            data['user'] = instance.user.username
            data['likes'] = instance.liked_by.count()
            return data

        def to_internal_value(self, data):
            recipe_data = data['recipe']
            return super().to_internal_value(recipe_data)

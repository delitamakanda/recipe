from .models import Recipe
from .serializers import RecipeSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return RecipeSerializer
        return RecipeSerializer

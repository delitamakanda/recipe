from .models import Recipe
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import RecipeListSerializer, RecipeSerializer
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class RecipeListViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = RecipeListSerializer
    queryset = Recipe.get_published_recipes()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RecipeListSerializer
        return RecipeSerializer


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter,]
    search_fields = ['title', 'instructions', 'ingredients']
    ordering_fields = ['created_at', 'updated_at', 'rating']
    filterset_fields = ['is_deleted', 'is_published', 'is_private', 'is_shared', 'user__username',]

    def get_queryset(self, *args, **kwargs):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            queryset = queryset.all()
        elif self.request.user.is_anonymous:
            queryset = queryset.filter(is_private=False, is_shared=False)
        elif self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        return queryset


    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return RecipeSerializer
        return RecipeListSerializer

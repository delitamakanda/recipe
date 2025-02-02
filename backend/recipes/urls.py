from .views import RecipeViewSet, RecipeListViewSet
from rest_framework.routers import DefaultRouter

app_name = 'recipes'

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'published-recipes', RecipeListViewSet, basename='published-recipes')

urlpatterns = router.urls

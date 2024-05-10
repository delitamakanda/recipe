from .views import RecipeViewSet
from rest_framework.routers import DefaultRouter

app_name = 'recipes'

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipes')

urlpatterns = router.urls

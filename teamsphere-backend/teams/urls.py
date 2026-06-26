from rest_framework.routers import DefaultRouter
from .views import TeamViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet)

urlpatterns = router.urls 
from . import views
from django.urls import path
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'eat_wise_api'})

urlpatterns = [
    path('health/', health_check, name='health-check'),
    # path('test/<int:pk>/', views.TestPostRetriveUpdateDestroyView.as_view(), name='test-detail'),
    # path('test/', views.TestListCreateView.as_view(), name='test-list-create'),
    path('users/', views.UserAPIView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', views.UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    # path('users/profiles/<int:pk>/', views.ProfileAPIView.as_view(), name='profile-detail'),
    path('register/', views.UserRegisterView.as_view(), name='user-register'),
    path('profile/', views.ProfileAPIView.as_view(), name='profile-detail'),
    path('foodItems/', views.FoodItemAPIView.as_view(), name='fooditem-list-create'),
    # path('foodItems/create/', views.FoodItemCreateView.as_view(), name='fooditem-manage'),
    path('foodItems/manage/<int:pk>/', views.FoodItemRetrieveUpdateDestroyView.as_view(), name='fooditem-detail'),
    path('resources/manage/', views.ResourcesCreateView.as_view(),name='resources-create'),

    path('userInventory/', views.UserInventoryListCreateView.as_view(), name='user-inventory-list'),
    path('userInventory/<int:pk>/', views.UserInventoryDetailView.as_view(), name='user-inventory-detail'),
    
    path('consumptionLogs/', views.ConsumptionLogListCreateView.as_view(), name='consumption-log-list'),
    path('consumptionLogs/<int:pk>/', views.ConsumptionLogDetailView.as_view(), name='consumption-log-detail'),
]
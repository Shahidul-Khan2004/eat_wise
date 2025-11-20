from . import views
from django.urls import path

urlpatterns = [
    path('test/<int:pk>/', views.TestPostRetriveUpdateDestroyView.as_view(), name='test-detail'),
    path('test/', views.TestListCreateView.as_view(), name='test-list-create'),
    path('users/', views.UserAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('users/profiles/<int:pk>/', views.ProfileAPIView.as_view(), name='profile-detail'),
]
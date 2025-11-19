from . import views
from django.urls import path

urlpatterns = [
    path('test/<int:pk>/', views.TestPostRetriveUpdateDestroyView.as_view(), name='test-detail'),
    path('test/', views.TestListCreateView.as_view(), name='test-list-create'),
]
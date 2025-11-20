from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import views
from rest_framework import generics
from .models import Test, Profile, FoodItem
from .serializers import TestSerializer, UserRegisterSerializer, ProfileSerializer, FoodItemSerializer

# Create your views here.
class TestListCreateView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestPostRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    lookup_field = 'pk'

class UserAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = []  # Allow unrestricted access for testing purposes

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = []  # Allow unrestricted access for testing purposes
    lookup_field = 'pk'

class ProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = []  # Allow unrestricted access for testing purposes
    lookup_field = 'pk'

class FoodItemAPIView(generics.ListAPIView):
    serializer_class = FoodItemSerializer

    def get_queryset(self):
        queryset = FoodItem.objects.all()
        order_by = self.request.query_params.get('orderBy', None)
        if order_by is not None:
            queryset = queryset.order_by(order_by)
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class FoodItemCreateView(generics.ListCreateAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer

class FoodItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    lookup_field = 'pk'
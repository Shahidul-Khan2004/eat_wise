from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .models import Test, Profile, FoodItem , Resources, UserInventory, ConsumptionLog
from .serializers import (TestSerializer, UserRegisterSerializer, ProfileSerializer,
                        FoodItemSerializer, TokenUserRegisterSerializer,ResourcesSerializer,
                        UserInventorySerializer, ConsumptionLogSerializer)

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

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TokenUserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

class FoodItemAPIView(generics.ListAPIView):
    serializer_class = FoodItemSerializer
    permission_classes = []

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
    permission_classes = []

class FoodItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = []
    lookup_field = 'pk'

# User Inventory Views
class UserInventoryListCreateView(generics.ListCreateAPIView):
    serializer_class = UserInventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show this user's inventory
        return UserInventory.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Auto-assign logged-in user when creating
        serializer.save(user=self.request.user)

class UserInventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserInventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserInventory.objects.filter(user=self.request.user)

# Consumption Log Views
class ConsumptionLogListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsumptionLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show this user's consumption logs
        return ConsumptionLog.objects.filter(user=self.request.user).order_by('-consumption_date')
    
    def perform_create(self, serializer):
        # Auto-assign logged-in user
        serializer.save(user=self.request.user)

class ConsumptionLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConsumptionLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ConsumptionLog.objects.filter(user=self.request.user)

#Oishi's First APIView 

class ResourcesCreateView(generics.ListAPIView):
    queryset = Resources.objects.all()
    serializer_class = ResourcesSerializer
    permission_classes = []
    
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .models import Test, Profile, FoodItem , Resources
from .serializers import (TestSerializer, UserRegisterSerializer, ProfileSerializer,
                        FoodItemSerializer, TokenUserRegisterSerializer,ResourcesSerializer)

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

#Oishi's First APIView 

class ResourcesCreateView(generics.ListCreateAPIView):
    queryset = Resources.objects.all()
    serializer_class = ResourcesSerializer
    permission_classes = []
    
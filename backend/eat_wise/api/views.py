from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import views
from rest_framework import generics
from .models import Test, Profile
from .serializers import TestSerializer, UserRegisterSerializer, ProfileSerializer

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
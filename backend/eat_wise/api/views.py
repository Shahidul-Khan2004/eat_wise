from django.shortcuts import render
from rest_framework import generics
from .models import Test
from .serializers import TestSerializer

# Create your views here.
class TestListCreateView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestPostRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    lookup_field = 'pk'

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Test, Profile, FoodItem,Resources 

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'name']

class UserRegisterSerializer(serializers.ModelSerializer):
    householdSize = serializers.IntegerField(write_only=True)
    dietaryPreferences = serializers.CharField(write_only=True)
    location = serializers.CharField(write_only=True)
    budgetRange = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'householdSize', 'dietaryPreferences', 'location', 'budgetRange']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        householdSize = validated_data.pop('householdSize')
        dietaryPreferences = validated_data.pop('dietaryPreferences')
        location = validated_data.pop('location')
        budgetRange = validated_data.pop('budgetRange')
        
        user = User.objects.create_user(**validated_data)

        Profile.objects.create(
            user=user,
            householdSize=householdSize,
            dietaryPreferences=dietaryPreferences,
            location=location,
            budgetRange=budgetRange
        )
        return user
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
        }

class TokenUserRegisterSerializer(UserRegisterSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return data
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = "__all__"


#Oishi's code starts here 

class ResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resources
        fields = "__all__"
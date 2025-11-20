from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    householdSize = models.PositiveIntegerField(default=1)
    dietaryPreferences = models.CharField(max_length=128)
    location = models.CharField(max_length=256)
    budgetRange = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.user.username}'s Profile"
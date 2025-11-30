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

class FoodItem(models.Model):
    name = models.CharField(max_length=128)
    category = models.CharField(max_length=256)
    expirationTimeDays = models.PositiveIntegerField()
    costPerUnit = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name + "expires in " + str(self.expirationTimeDays) + " days"

class UserInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_inventory')
    food_item = models.ForeignKey('FoodItem', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, default='units')
    purchase_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', '-purchase_date']),
        ]
        ordering = ['-purchase_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.food_item.name} ({self.quantity} {self.unit})"

class ConsumptionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consumption_logs')
    food_item = models.ForeignKey('FoodItem', on_delete=models.CASCADE)
    quantity_consumed = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, default='units')
    consumption_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', '-consumption_date']),
        ]
        ordering = ['-consumption_date']
    
    def __str__(self):
        return f"{self.user.username} consumed {self.quantity_consumed} {self.unit} of {self.food_item.name}"

#Oishi's code starts here
class Resources(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    url = models.URLField(blank=True,null=True)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.title



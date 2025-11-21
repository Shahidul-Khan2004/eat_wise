from .models import FoodItem
from decimal import Decimal

def run():
    data = [
        # ---------- FRUITS ----------
        {
            "name": "Apple",
            "category": "Fruit",
            "expirationTimeDays": 14,
            "costPerUnit": Decimal("20.00")
        },
        {
            "name": "Banana",
            "category": "Fruit",
            "expirationTimeDays": 7,
            "costPerUnit": Decimal("8.00")
        },
        {
            "name": "Orange",
            "category": "Fruit",
            "expirationTimeDays": 14,
            "costPerUnit": Decimal("25.00")
        },
        {
            "name": "Grapes",
            "category": "Fruit",
            "expirationTimeDays": 10,
            "costPerUnit": Decimal("30.00")
        },

        # ---------- VEGETABLES ----------
        {
            "name": "Carrot",
            "category": "Vegetable",
            "expirationTimeDays": 21,
            "costPerUnit": Decimal("10.00")
        },
        {
            "name": "Tomato",
            "category": "Vegetable",
            "expirationTimeDays": 7,
            "costPerUnit": Decimal("30.00")
        },
        {
            "name": "Spinach",
            "category": "Vegetable",
            "expirationTimeDays": 4,
            "costPerUnit": Decimal("20.00")
        },
        {
            "name": "Potato",
            "category": "Vegetable",
            "expirationTimeDays": 30,
            "costPerUnit": Decimal("18.00")
        },

        # ---------- DAIRY ----------
        {
            "name": "Milk",
            "category": "Dairy",
            "expirationTimeDays": 7,
            "costPerUnit": Decimal("90.00")
        },
        {
            "name": "Butter",
            "category": "Dairy",
            "expirationTimeDays": 60,
            "costPerUnit": Decimal("90.00")
        },
        {
            "name": "Yogurt",
            "category": "Dairy",
            "expirationTimeDays": 14,
            "costPerUnit": Decimal("40.00")
        },
        {
            "name": "Cheese",
            "category": "Dairy",
            "expirationTimeDays": 30,
            "costPerUnit": Decimal("120.00")
        },

        # ---------- PROTEIN ----------
        {
            "name": "Eggs",
            "category": "Protein",
            "expirationTimeDays": 21,
            "costPerUnit": Decimal("12.00")
        },
        {
            "name": "Chicken Breast",
            "category": "Protein",
            "expirationTimeDays": 5,
            "costPerUnit": Decimal("160.00")
        },
        {
            "name": "Beef",
            "category": "Protein",
            "expirationTimeDays": 4,
            "costPerUnit": Decimal("180.00")
        },
        {
            "name": "Lentils",
            "category": "Protein",
            "expirationTimeDays": 180,
            "costPerUnit": Decimal("70.00")
        },

        # ---------- GRAINS ----------
        {
            "name": "Rice",
            "category": "Grain",
            "expirationTimeDays": 180,
                       "costPerUnit": Decimal("65.00")
        },
        {
            "name": "Bread",
            "category": "Grain",
            "expirationTimeDays": 5,
            "costPerUnit": Decimal("55.00")
        },

        # ---------- NUTS ----------
        {
            "name": "Almonds",
            "category": "Nuts",
            "expirationTimeDays": 365,
            "costPerUnit": Decimal("160.00")
        },

        # ---------- SPREAD ----------
        {
            "name": "Peanut Butter",
            "category": "Spread",
            "expirationTimeDays": 180,
            "costPerUnit": Decimal("200.00")
        }
    ]

    for item in data:
        FoodItem.objects.create(**item)

    print("FoodItems seeded successfully!")

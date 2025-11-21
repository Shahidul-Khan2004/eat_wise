from .models import Resources

def run():

     data = [
        {
            "title": "Proper Vegetable Storage Guide",
            "description": "Learn how to store vegetables to extend freshness and prevent waste.",
            "url": "https://www.lovefoodhatewaste.com/article/how-store-vegetables",
            "category": "storage tips",
            "type": "article"
        },
        {
            "title": "How to Store Fruits for Longer Life",
            "description": "Simple fruit storage techniques that reduce spoilage.",
            "url": "https://www.healthline.com/nutrition/store-fruit",
            "category": "storage tips",
            "type": "article"
        },
        {
            "title": "Dairy Storage Best Practices",
            "description": "Tips to store milk, cheese, and yogurt safely to reduce waste.",
            "url": "https://www.foodsafety.gov/keep-food-safe",
            "category": "dairy",
            "type": "tip"
        },
        {
            "title": "Reducing Food Waste at Home",
            "description": "Practical ways to reduce household food waste every day.",
            "url": "https://www.wwf.org.uk/updates/10-tips-reduce-food-waste",
            "category": "sustainability",
            "type": "article"
        },
        {
            "title": "Meal Planning for Less Waste",
            "description": "Plan meals efficiently to avoid buying unnecessary ingredients.",
            "url": "https://www.bbcgoodfood.com/howto/guide/meal-planning",
            "category": "planning",
            "type": "article"
        },
        {
            "title": "Freezing Fruits and Vegetables",
            "description": "Step-by-step guide to freezing produce to maintain nutrients.",
            "url": "https://www.fda.gov/food/consumers/freezing-food-safety",
            "category": "storage tips",
            "type": "guide"
        },
        {
            "title": "Proper Meat Storage",
            "description": "How to store raw and cooked meats to prevent contamination.",
            "url": "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat",
            "category": "meat",
            "type": "tip"
        },
        {
            "title": "Understanding Expiration Dates",
            "description": "Learn what 'best before' and 'use by' dates really mean.",
            "url": "https://www.eatright.org/food/nutrition/healthy-eating/food-labels-and-date-labels",
            "category": "awareness",
            "type": "article"
        },
        {
            "title": "Leftover Safety Tips",
            "description": "How to store and reheat leftovers safely.",
            "url": "https://www.foodsafety.gov/food-safety-charts/leftovers-and-food-safety",
            "category": "safety",
            "type": "tip"
        },
        {
            "title": "Composting Food Scraps",
            "description": "Turn food waste into nutrient-rich compost for your garden.",
            "url": "https://www.epa.gov/recycle/composting-home",
            "category": "sustainability",
            "type": "guide"
        },
        {
            "title": "Storing Bread Properly",
            "description": "Keep bread fresh longer using proper storage techniques.",
            "url": "https://www.thekitchn.com/how-to-store-bread-221220",
            "category": "storage tips",
            "type": "tip"
        },
        {
            "title": "Smart Shopping Tips",
            "description": "Buy only what you need to reduce food waste.",
            "url": "https://www.lovefoodhatewaste.com/article/10-smart-shopping-tips",
            "category": "planning",
            "type": "article"
        },
        {
            "title": "Canning and Preserving Foods",
            "description": "Preserve fruits and vegetables safely at home.",
            "url": "https://www.fda.gov/food/consumers/home-canning",
            "category": "storage tips",
            "type": "guide"
        },
        {
            "title": "Understanding Food Labels",
            "description": "Decode food labels to make smarter choices.",
            "url": "https://www.fda.gov/consumers/consumer-updates/how-understand-nutrition-facts-label",
            "category": "awareness",
            "type": "article"
        },
        {
            "title": "Minimizing Dairy Waste",
            "description": "Tips for using milk, cheese, and yogurt before they spoil.",
            "url": "https://www.healthline.com/nutrition/foods-that-spoil-fast",
            "category": "dairy",
            "type": "tip"
        },
        {
            "title": "Leftover Vegetable Recipes",
            "description": "Creative recipes to use leftover vegetables efficiently.",
            "url": "https://www.bbcgoodfood.com/recipes/collection/leftovers",
            "category": "recipes",
            "type": "guide"
        },
        {
            "title": "Reducing Plastic Packaging",
            "description": "Choose sustainable packaging to reduce food-related plastic waste.",
            "url": "https://www.wwf.org.uk/updates/7-tips-reduce-plastic-waste",
            "category": "sustainability",
            "type": "article"
        },
        {
            "title": "Storing Eggs Safely",
            "description": "Keep eggs fresh longer by storing them properly in the fridge.",
            "url": "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs",
            "category": "dairy",
            "type": "tip"
        },
        {
            "title": "Smart Freezer Organization",
            "description": "Tips to organize your freezer for easy access and minimal waste.",
            "url": "https://www.goodhousekeeping.com/food-recipes/cooking/a33872/how-to-organize-freezer/",
            "category": "storage tips",
            "type": "guide"
        },
        {
            "title": "Reducing Food Waste in Restaurants",
            "description": "Best practices for restaurants to minimize food waste.",
            "url": "https://www.epa.gov/sustainable-management-food/food-recovery-hierarchy",
            "category": "awareness",
            "type": "article"
        }
       ]
     for item in data:
         Resources.objects.create(**item)

         
         
     print("Resources seeded successfully!")
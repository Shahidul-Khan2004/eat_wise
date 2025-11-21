# Eat Wise

## Project Overview
Eat Wise is a full-stack web application for managing household food inventory, logging consumption, and accessing food-related resources. It helps users track what they have, reduce waste, and make informed dietary choices.

## Tech Stack
- **Backend:** Django 5, Django REST Framework, SQLite3
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** JWT (djangorestframework-simplejwt)
- **CORS:** django-cors-headers

## Setup Steps

### Backend
1. Create and activate a Python virtual environment:
   ```powershell
   python -m venv myenv
   .\myenv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Apply migrations and start the server:
   ```powershell
   cd backend/eat_wise
   python manage.py migrate
   python manage.py runserver 8000
   ```

### Frontend
1. Serve static files (for local development):
   ```powershell
   cd frontend
   python -m http.server 8080
   ```
2. Open `http://localhost:8080/index.html` in your browser.

## Environment Configuration Notes
- CORS is enabled for local development (`CORS_ALLOW_ALL_ORIGINS = True`). For production, restrict origins in `settings.py`.
- JWT token lifetimes and authentication settings are configured in `settings.py`.
- Database is SQLite3 by default; change `ENGINE` in `settings.py` for production.
- Static files are served from the `frontend` folder.

## Seed Data Usage Instructions
- To add initial food items or resources, use Django admin or create fixtures.
- Example: To create a superuser for admin access:
   ```powershell
   python manage.py createsuperuser
   ```
- You can then log in at `http://127.0.0.1:8000/admin/` and add FoodItem, Resources, etc.

## Code Organization
- **backend/eat_wise/api/**
  - `models.py`: Database models (User, Profile, FoodItem, UserInventory, ConsumptionLog, Resources)
  - `serializers.py`: DRF serializers for API endpoints
  - `views.py`: API views (CRUD for inventory, consumption, profile, resources)
  - `urls.py`: API route definitions
- **frontend/**
  - HTML files for each page (index, profile, inventory, resources, login, register)
  - CSS files for global and page-specific styles
  - JS files for page logic and API calls
  - `nav.js`: Dynamic navbar

---
For questions or issues, please open an issue or contact the maintainer.

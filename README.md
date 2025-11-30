# 🍽️ Eat Wise

> Smart food management for every household - Track inventory, reduce waste, and make informed dietary choices.

**Live Demo:** 
- Frontend: [https://eat-wise-silk.netlify.app/](https://eat-wise-silk.netlify.app/)
- Backend API: [https://eat-wise-silk.vercel.app/api/](https://eat-wise-silk.vercel.app/api/)

## 📚 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Local Setup](#-local-setup)
- [Loading Sample Data](#-loading-sample-data)
- [Deployment](#-deployment)

## 🛠 Tech Stack

### Backend
- Django 5.1.3
- Django REST Framework 3.15.2
- djangorestframework-simplejwt 5.3.1 (JWT Authentication)
- django-cors-headers 4.5.0
- PostgreSQL (Production) / SQLite3 (Development)

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Responsive design
- JWT token-based authentication

### Infrastructure
- **Backend Hosting:** Vercel (Serverless)
- **Frontend Hosting:** Netlify
- **Database:** Supabase PostgreSQL (Production)

## ✨ Features

- 🔐 User authentication (Register/Login with JWT)
- 👤 User profile management
- 📦 Food inventory tracking
- 🍴 Consumption logging
- 📊 Food item database with categories
- 📚 Educational resources library
- 🔄 Real-time data synchronization

## 🚀 Local Setup

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Shahidul-Khan2004/eat_wise.git
cd eat_wise
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Database

**Option A: SQLite (Quick Start - Default)**

No configuration needed! SQLite database will be created automatically.

**Option B: PostgreSQL/Supabase (Recommended for Production)**

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your database connection string from: **Settings → Database → Connection String (URI)**
3. Create `.env` file in `backend/eat_wise/`:

```bash
# backend/eat_wise/.env
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DEBUG=True

# For Supabase (use Session pooler for local, Transaction pooler for Vercel)
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# Optional: If using Supabase client directly (not needed for basic setup)
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
```

4. Update `backend/eat_wise/eat_wise/settings.py` if needed (already configured to read `DATABASE_URL`)

#### Run Migrations
```bash
cd backend/eat_wise
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Start Backend Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000/api/`

### 3. Frontend Setup

Open a **new terminal** (keep backend running):

```bash
cd frontend
python -m http.server 8080
```

Frontend will be available at: `http://localhost:8080/`

**Important:** Update API URLs in frontend if needed:
- By default, frontend is configured to use the production API: `https://eat-wise-silk.vercel.app/api/`
- For local backend, update in each JS file:
  ```javascript
  const apiBase = 'http://localhost:8000/api';
  ```

## 📊 Loading Sample Data

### Option 1: Load from data.json (Food Items & Resources)

```bash
cd backend/eat_wise

# Load food items
python manage.py shell
>>> from api.seed_fooditem import seed_food_items
>>> seed_food_items()
>>> exit()

# Load resources
python manage.py shell
>>> from api.seed_resources import seed_resources
>>> seed_resources()
>>> exit()
```

### Option 2: Use Django Admin

1. Start the server: `python manage.py runserver`
2. Go to: `http://localhost:8000/admin/`
3. Login with superuser credentials
4. Add data manually through the admin interface

### Option 3: Import data.json to Supabase (Production)

If using Supabase:

1. Go to Supabase Dashboard → **Table Editor**
2. Select table (`api_fooditem` or `api_resources`)
3. Click **Insert → Insert row** or use **SQL Editor** to bulk import

Example SQL for bulk import:
```sql
INSERT INTO api_fooditem (name, category, "expirationTimeDays", "costPerUnit")
VALUES 
  ('Apple', 'Fruit', 7, 2.50),
  ('Banana', 'Fruit', 5, 1.50);
```

## 🌐 Deployment

### Backend Deployment (Vercel)

#### Prerequisites
- Vercel account: [https://vercel.com](https://vercel.com)
- Supabase database (required for production)

#### Important: Use Session Pooler for Vercel!

⚠️ **Critical:** Vercel serverless functions require connection pooling. Use Supabase's **Transaction Mode Pooler**:

1. Go to Supabase Dashboard → **Settings → Database**
2. Find **Connection Pooling** section
3. Use the **Transaction mode** connection string (port `6543`)
   ```
   postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres
   ```
4. **Do NOT use** Session mode (port `5432`) - it won't work with Vercel!

#### Deployment Steps

1. **Connect GitHub to Vercel:**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Python

2. **Set Environment Variables:**
   - Go to: **Project Settings → Environment Variables**
   - Add:
     ```
     DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres
     SECRET_KEY=your-production-secret-key
     DEBUG=False
     ```

3. **Deploy:**
   - Click **Deploy**
   - Wait 2-3 minutes
   - Your API will be live at: `https://your-project.vercel.app/api/`

4. **Run Migrations:**
   ```bash
   # Locally, connect to production database
   cd backend/eat_wise
   DATABASE_URL="your-supabase-url" python manage.py migrate
   ```

### Frontend Deployment (Netlify)

#### Option 1: Drag & Drop (Easiest)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `frontend/` folder
3. Done! Your site is live

#### Option 2: GitHub Integration (Automatic Deployments)
1. Go to [https://app.netlify.com/start](https://app.netlify.com/start)
2. Connect your GitHub repository
3. **Build settings:**
   - Base directory: `frontend`
   - Publish directory: `frontend`
4. Deploy

## 📝 Project Structure

```
eat_wise/
├── backend/
│   └── eat_wise/
│       ├── api/                    # Django app
│       │   ├── models.py           # Database models
│       │   ├── views.py            # API views
│       │   ├── serializers.py      # DRF serializers
│       │   ├── urls.py             # API routes
│       │   └── migrations/         # Database migrations
│       ├── eat_wise/
│       │   ├── settings.py         # Django configuration
│       │   ├── urls.py             # Main URL routing
│       │   └── wsgi.py             # WSGI entry point
│       ├── manage.py               # Django management
│       └── data.json               # Sample data
├── frontend/
│   ├── index.html                  # Landing page
│   ├── login.html                  # Login page
│   ├── register.html               # Registration
│   ├── profile.html                # User profile
│   ├── inventory.html              # Food inventory
│   ├── resources.html              # Educational resources
│   └── *.js, *.css                 # JavaScript and styles
├── index.py                        # Vercel entry point
├── vercel.json                     # Vercel configuration
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Shahidul Khan - [GitHub](https://github.com/Shahidul-Khan2004)

## 🙏 Acknowledgments

- Django Documentation
- Django REST Framework
- Supabase
- Vercel
- Netlify
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

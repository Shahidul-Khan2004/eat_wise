# 🚀 Complete Guide: Deploying Django Backend to Vercel

## 📚 Table of Contents
1. [Project Structure Overview](#project-structure)
2. [Understanding Vercel](#understanding-vercel)
3. [Key Configuration Files Explained](#configuration-files)
4. [How Django Works](#how-django-works)
5. [How the Deployment Works](#deployment-flow)
6. [Environment Variables](#environment-variables)
7. [Step-by-Step Deployment Guide](#deployment-steps)
8. [Troubleshooting Common Issues](#troubleshooting)

---

## 📁 Project Structure Overview

Your project has this structure:
```
eat_wise/
├── backend/
│   └── eat_wise/              # Django project root
│       ├── api/               # Your Django app (models, views, serializers)
│       │   ├── models.py      # Database models (Profile, FoodItem, etc.)
│       │   ├── views.py       # API endpoints logic
│       │   ├── serializers.py # DRF serializers for JSON conversion
│       │   ├── urls.py        # API routes (/foodItems/, /profile/, etc.)
│       │   └── migrations/    # Database schema changes
│       ├── eat_wise/          # Django settings folder
│       │   ├── settings.py    # Configuration (database, middleware, etc.)
│       │   ├── urls.py        # Main URL routing
│       │   ├── wsgi.py        # Web Server Gateway Interface
│       │   └── asgi.py        # Async server (not used for Vercel)
│       └── manage.py          # Django command-line tool
├── frontend/                  # Your HTML/CSS/JS files (not deployed to Vercel)
├── index.py                   # ⭐ VERCEL ENTRY POINT (we created this)
├── vercel.json                # ⭐ VERCEL CONFIG (we created this)
├── .vercelignore              # ⭐ Files to exclude from deployment
├── requirements.txt           # Python dependencies
└── build_files.sh             # Build script (simplified to do nothing)
```

---

## 🌐 Understanding Vercel

### What is Vercel?
Vercel is a **serverless hosting platform**. Unlike traditional servers that run 24/7, serverless means:
- Your code only runs when someone makes a request
- You don't manage servers (Vercel does it for you)
- You pay only for actual usage (very cheap/free for small projects)

### How Vercel Handles Python/Django
Vercel uses **serverless functions** (also called AWS Lambda behind the scenes):
- Each HTTP request triggers your Python code
- Your Django app runs for that request, returns a response, then stops
- Vercel automatically scales (handles 1 or 1000 requests without you doing anything)

### Key Limitation
⚠️ **Vercel's filesystem is READ-ONLY**
- You CANNOT use SQLite (file-based database) in production
- You MUST use an external database (PostgreSQL, MySQL, etc.)
- That's why we use Supabase PostgreSQL

---

## 📄 Key Configuration Files Explained

### 1. **`vercel.json`** - The Master Configuration File

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "15mb",
        "runtime": "python3.9"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.py"
    }
  ]
}
```

**Line-by-line breakdown:**

| Line | What It Does |
|------|--------------|
| `"version": 2` | Uses Vercel's v2 configuration format |
| `"builds"` | Tells Vercel HOW to build your project |
| `"src": "index.py"` | The file Vercel should execute |
| `"use": "@vercel/python"` | Use Python runtime (not Node.js or Go) |
| `"maxLambdaSize": "15mb"` | Allow up to 15MB deployment size (Django + dependencies) |
| `"runtime": "python3.9"` | Use Python 3.9 specifically |
| `"routes"` | Tells Vercel WHERE to send incoming requests |
| `"src": "/(.*)"` | Match ALL URLs (everything: /api/foodItems/, /admin/, etc.) |
| `"dest": "index.py"` | Send all those requests to index.py |

**Why this works:**
- Vercel looks at `vercel.json` first
- It sees "index.py is my entry point"
- Every HTTP request → Goes to index.py → Runs Django → Returns response

---

### 2. **`index.py`** - The Bridge Between Vercel and Django

```python
import os
import sys

# Add the Django project to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'eat_wise'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eat_wise.settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the application
application = get_wsgi_application()

# Vercel expects 'app' as the handler
app = application
```

**Line-by-line breakdown:**

| Code | What It Does | Why It's Needed |
|------|--------------|-----------------|
| `import os, sys` | Import Python modules for file/system operations | Standard Python |
| `sys.path.insert(0, ...)` | Tell Python "look in backend/eat_wise/ folder for modules" | Django is nested, Python needs to find it |
| `os.path.dirname(__file__)` | Gets the directory where index.py lives (project root) | Dynamic path (works in any environment) |
| `'backend', 'eat_wise'` | Joins paths → `/vercel/path0/backend/eat_wise` | Where your Django project actually is |
| `os.environ.setdefault('DJANGO_SETTINGS_MODULE', ...)` | Tells Django "use eat_wise.settings for configuration" | Django needs to know which settings to use |
| `get_wsgi_application()` | Creates a WSGI app (standard Python web interface) | Django's way of handling HTTP requests |
| `app = application` | Creates variable named `app` | Vercel specifically looks for a variable named `app` |

**Why this file exists:**
- Vercel can't directly run Django (it's nested in backend/eat_wise/)
- This file sits at the project root where Vercel expects it
- It sets up Python paths so Django can be imported
- It creates the `app` object Vercel needs

**The Flow:**
```
HTTP Request → Vercel → index.py → Django WSGI → Your Views → JSON Response
```

---

### 3. **`.vercelignore`** - What NOT to Deploy

```
.venv
myenv/
__pycache__/
*.pyc
.env
*.sqlite3
db.sqlite3
frontend/
.vscode/
.git/
```

**What each line does:**

| Pattern | Excludes | Why |
|---------|----------|-----|
| `.venv`, `myenv/` | Virtual environments | Huge, unnecessary (Vercel installs fresh) |
| `__pycache__/`, `*.pyc` | Python compiled files | Generated automatically, not needed |
| `.env` | Environment variables file | Security risk (has passwords) |
| `*.sqlite3`, `db.sqlite3` | SQLite databases | Won't work on Vercel (read-only filesystem) |
| `frontend/` | Frontend files | We're only deploying backend |
| `.vscode/` | VS Code settings | Development tool files |
| `.git/` | Git history | Huge, not needed for running the app |

**Why exclude files:**
- Faster uploads (less data to send)
- Smaller deployment size (Vercel has limits)
- Security (don't upload secrets)

---

### 4. **`requirements.txt`** - Python Dependencies

```
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
pillow
dj-database-url
psycopg[binary]
supabase
python-dotenv
```

**What each package does:**

| Package | Purpose |
|---------|---------|
| `django` | The web framework itself |
| `djangorestframework` | Adds REST API capabilities (JSON responses) |
| `djangorestframework-simplejwt` | JWT token authentication |
| `django-cors-headers` | Allows frontend (different domain) to call API |
| `pillow` | Image processing (for profile pictures, etc.) |
| `dj-database-url` | Parse DATABASE_URL environment variable |
| `psycopg[binary]` | PostgreSQL database adapter (connects to Supabase) |
| `supabase` | Supabase Python client (optional, for direct usage) |
| `python-dotenv` | Load .env files (for local development) |

**How Vercel uses this:**
1. Reads requirements.txt
2. Runs `pip install -r requirements.txt`
3. Installs all packages into the serverless function
4. Your code can now import them

---

### 5. **`settings.py`** - Django Configuration (CRITICAL)

#### **Environment Variables (Production-Ready)**

```python
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-...')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ["127.0.0.1", "0.0.0.0", "localhost", ".vercel.app"]
```

| Setting | What It Does | Why Important |
|---------|--------------|---------------|
| `os.getenv('SECRET_KEY', ...)` | Read SECRET_KEY from environment, or use fallback | Security: different key for dev vs prod |
| `DEBUG = ... == 'True'` | Only True if env variable is literally "True" | Safety: DEBUG exposes errors (don't show in prod) |
| `ALLOWED_HOSTS` | Domains allowed to serve this Django app | Security: prevents host header attacks |
| `.vercel.app` | Wildcard for all Vercel deployments | Matches your-app.vercel.app, your-app-git-main.vercel.app, etc. |

#### **Database Configuration**

```python
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

| Part | What It Does |
|------|--------------|
| `dj_database_url.config()` | Parses DATABASE_URL environment variable |
| `default=f'sqlite://...'` | Fallback to SQLite if DATABASE_URL not set (for local dev) |
| `conn_max_age=600` | Keep database connections alive for 10 minutes (performance) |
| `conn_health_checks=True` | Test connection before using (prevents stale connections) |

**How it works:**
1. On Vercel: `DATABASE_URL` env variable exists → Uses Supabase PostgreSQL
2. Locally: No `DATABASE_URL` → Uses SQLite (db.sqlite3 file)

#### **CORS Configuration**

```python
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = ["https://*.vercel.app"]
```

| Setting | Purpose |
|---------|---------|
| `CORS_ALLOW_ALL_ORIGINS` | Allow requests from ANY domain |
| `CSRF_TRUSTED_ORIGINS` | Trust POST requests from Vercel domains |

**Why needed:**
- Your frontend is on a different domain (e.g., `myapp.vercel.app`)
- Your backend is on `eat-wise-silk.vercel.app`
- Without CORS, browsers block cross-domain requests (security)

#### **JWT Authentication**

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

**What this means:**
- Every API request must include a JWT token
- Access tokens expire after 5 minutes (security)
- Refresh tokens last 1 day (user doesn't need to log in constantly)
- Users login → Get access + refresh tokens → Use access token for requests → When expired, use refresh token to get new access token

---

### 6. **`wsgi.py`** - Web Server Gateway Interface

```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eat_wise.settings')
application = get_wsgi_application()
app = application
```

**What is WSGI?**
- Standard interface between web servers and Python web apps
- Think of it as a translator: HTTP Request → Python Function Call → HTTP Response

**Why both wsgi.py and index.py?**
- `wsgi.py`: Django's standard WSGI file (used by traditional servers like Gunicorn)
- `index.py`: Vercel-specific entry point (sets up paths, then imports wsgi)
- We could merge them, but keeping wsgi.py separate is Django convention

---

## 🔄 How the Deployment Works (Step-by-Step)

### **What Happens When You Push to GitHub:**

```
1. You run: git push origin master
   ↓
2. GitHub receives your code
   ↓
3. Vercel detects the push (if connected to GitHub)
   ↓
4. Vercel starts deployment:
   
   BUILD PHASE:
   ├─ Clones your repository
   ├─ Reads vercel.json
   ├─ Sees: "src": "index.py", "use": "@vercel/python"
   ├─ Creates a Python 3.9 environment
   ├─ Reads requirements.txt
   ├─ Runs: pip install django djangorestframework ... (all dependencies)
   ├─ Packages everything into a serverless function (15MB max)
   └─ Uploads to Vercel's CDN
   
5. Deployment goes live at: https://eat-wise-silk.vercel.app
   ↓
6. Status: READY ✅
```

### **What Happens When Someone Visits Your API:**

```
User's browser: fetch('https://eat-wise-silk.vercel.app/api/foodItems/')
   ↓
1. Request hits Vercel's edge network (CDN)
   ↓
2. Vercel: "This needs index.py serverless function"
   ↓
3. Vercel creates a container (if not already warm):
   - Loads Python 3.9
   - Loads your code + dependencies
   - Runs index.py
   ↓
4. index.py executes:
   - Sets sys.path to find Django
   - Sets DJANGO_SETTINGS_MODULE
   - Imports Django WSGI app
   - Returns 'app' object
   ↓
5. Vercel passes HTTP request to 'app'
   ↓
6. Django processes request:
   - Matches URL: /api/foodItems/ → urls.py → api/urls.py
   - Calls FoodItemAPIView
   - Queries PostgreSQL (Supabase)
   - Serializes data to JSON
   - Returns HTTP response
   ↓
7. Response goes back: Vercel → CDN → User's browser
   ↓
8. User sees: [{"name": "Apple", "category": "Fruit", ...}, ...]
```

**Cold Start vs Warm Start:**
- **Cold Start**: First request after inactivity (~1-3 seconds)
  - Vercel spins up new container
  - Loads Python + dependencies
  - Slow first request
- **Warm Start**: Subsequent requests (<100ms)
  - Container already running
  - Very fast

---

## 🔐 Environment Variables (CRUCIAL for Security)

### **What Are Environment Variables?**
- Configuration values stored OUTSIDE your code
- Accessed via `os.getenv('VARIABLE_NAME')`
- Different for dev vs production

### **Why Use Them?**
```python
# ❌ BAD (hardcoded, visible in GitHub)
DATABASE_URL = "postgresql://user:password123@db.com/mydb"

# ✅ GOOD (reads from environment)
DATABASE_URL = os.getenv('DATABASE_URL')
```

### **Required Environment Variables for Your Project:**

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SECRET_KEY` | Django secret key (for sessions, CSRF) | `django-insecure-abc123xyz...` (generate new!) |
| `DEBUG` | Enable/disable debug mode | `False` (always False in production) |

### **How to Set in Vercel:**

1. Go to: https://vercel.com/dashboard
2. Select your project: `eat_wise`
3. Click: **Settings** → **Environment Variables**
4. Add variables:
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   
   Name: SECRET_KEY
   Value: your-new-secret-key-here-make-it-long-and-random
   
   Name: DEBUG
   Value: False
   ```
5. Click **Save**
6. Redeploy (Vercel will use new env vars)

### **How to Get Your Supabase DATABASE_URL:**

1. Go to Supabase Dashboard
2. Your project → **Settings** → **Database**
3. Find "Connection string" section
4. Select "URI" format
5. Copy the full string (looks like: `postgresql://postgres.xxx...`)
6. Important: Replace `[YOUR-PASSWORD]` with your actual database password

---

## 📋 Step-by-Step Deployment Guide (For Next Time)

### **Prerequisites:**
- GitHub account
- Vercel account (free tier)
- Django project ready
- External database (Supabase, Neon, etc.)

### **Step 1: Prepare Your Django Project**

```bash
# Your Django project structure should be:
myproject/
├── backend/
│   └── mydjango/          # Django project folder
│       ├── myapp/         # Your Django app
│       │   ├── models.py
│       │   ├── views.py
│       │   ├── serializers.py
│       │   └── urls.py
│       ├── mydjango/      # Settings folder
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       └── manage.py
└── ... (we'll add files here)
```

### **Step 2: Create Vercel Configuration Files**

**2.1 Create `index.py` at project root:**

```python
import os
import sys

# CHANGE THIS: Replace 'backend/mydjango' with your actual path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'mydjango'))

# CHANGE THIS: Replace 'mydjango.settings' with your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mydjango.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
app = application
```

**2.2 Create `vercel.json` at project root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "15mb",
        "runtime": "python3.9"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.py"
    }
  ]
}
```

**2.3 Create `.vercelignore` at project root:**

```
.venv
venv/
__pycache__/
*.pyc
.env
*.sqlite3
db.sqlite3
.vscode/
.git/
node_modules/
```

**2.4 Create `requirements.txt` at project root:**

```
django>=5.0
djangorestframework
dj-database-url
psycopg[binary]
# Add other dependencies your project needs
```

### **Step 3: Update Django Settings**

Edit `backend/mydjango/mydjango/settings.py`:

```python
import os
import dj_database_url

# Environment-based configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-change-in-production')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".vercel.app"]

# Database - uses DATABASE_URL environment variable
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',  # Fallback for local dev
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS (if using separate frontend)
CORS_ALLOW_ALL_ORIGINS = True  # Or specify exact origins
CSRF_TRUSTED_ORIGINS = ["https://*.vercel.app"]
```

### **Step 4: Test Locally**

```bash
# 1. Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Test the index.py works
python -c "from index import app; print('✓ index.py imports successfully')"

# 4. Run migrations
cd backend/mydjango
python manage.py migrate

# 5. Start dev server
python manage.py runserver

# 6. Test API
curl http://localhost:8000/api/your-endpoint/
```

### **Step 5: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Django backend for Vercel"
git branch -M main
git remote add origin https://github.com/yourusername/yourproject.git
git push -u origin main
```

### **Step 6: Deploy to Vercel**

**Option A: Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Python (sees vercel.json)
5. Add environment variables:
   - DATABASE_URL
   - SECRET_KEY
   - DEBUG=False
6. Click "Deploy"
7. Wait ~2 minutes
8. Done! Your URL: `https://yourproject.vercel.app`

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
# Set environment variables when asked

# Production deployment
vercel --prod
```

### **Step 7: Verify Deployment**

```bash
# Test your API
curl https://yourproject.vercel.app/api/your-endpoint/

# Or open in browser
https://yourproject.vercel.app/api/your-endpoint/
```

---

## 🐛 Troubleshooting Common Issues

### **Issue 1: "Module not found" Error**

**Error:**
```
ModuleNotFoundError: No module named 'django'
```

**Cause:** Vercel didn't install dependencies

**Solution:**
- Ensure `requirements.txt` is in project root (not nested)
- Check requirements.txt has correct package names
- Redeploy

---

### **Issue 2: "404 Not Found" on All Endpoints**

**Error:** Every URL returns 404

**Cause:** Routing misconfigured

**Solutions:**

1. **Check vercel.json routes:**
   ```json
   "routes": [
     {
       "src": "/(.*)",        // Must capture everything
       "dest": "index.py"     // Must match your entry file
     }
   ]
   ```

2. **Check index.py path:**
   ```python
   # This path must match your actual structure
   sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'eat_wise'))
   ```

3. **Check DJANGO_SETTINGS_MODULE:**
   ```python
   # Format: 'projectfolder.settings'
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eat_wise.settings')
   ```

---

### **Issue 3: "DisallowedHost" Error**

**Error:**
```
DisallowedHost at /api/foodItems/
Invalid HTTP_HOST header: 'yourapp.vercel.app'
```

**Cause:** Your domain not in ALLOWED_HOSTS

**Solution:** Update settings.py:
```python
ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".vercel.app"]
# The dot before vercel.app allows ALL subdomains
```

---

### **Issue 4: Database Connection Fails**

**Error:**
```
django.db.utils.OperationalError: could not connect to server
```

**Causes & Solutions:**

1. **Missing DATABASE_URL:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add DATABASE_URL with your Supabase connection string

2. **Wrong connection string format:**
   ```
   ✅ CORRECT:
   postgresql://user:pass@host.supabase.com:5432/postgres
   
   ❌ WRONG:
   postgres://... (should be postgresql://)
   ```

3. **Supabase connection pooler:**
   - Use "Transaction" mode pooler (port 6543)
   - Not "Session" mode (port 5432)
   - Check Supabase Dashboard → Settings → Database

---

### **Issue 5: CORS Errors in Frontend**

**Error (in browser console):**
```
Access to fetch at 'https://api.vercel.app/api/...' from origin 'https://frontend.vercel.app' 
has been blocked by CORS policy
```

**Cause:** Backend doesn't allow frontend's domain

**Solution:** In settings.py:
```python
# Option 1: Allow all (development/testing only)
CORS_ALLOW_ALL_ORIGINS = True

# Option 2: Specific origins (production recommended)
CORS_ALLOWED_ORIGINS = [
    "https://yourfrontend.vercel.app",
    "http://localhost:3000",  # For local dev
]

# Also add:
CSRF_TRUSTED_ORIGINS = ["https://*.vercel.app"]
```

---

### **Issue 6: Environment Variables Not Working**

**Error:** Settings use default values instead of env vars

**Causes:**

1. **Variables not set in Vercel:**
   - Check: Vercel Dashboard → Project → Settings → Environment Variables
   - Make sure they're added

2. **Typo in variable name:**
   ```python
   # Code says:
   SECRET_KEY = os.getenv('SECRT_KEY')  # ❌ Typo
   
   # Should be:
   SECRET_KEY = os.getenv('SECRET_KEY')  # ✅ Correct
   ```

3. **Need to redeploy after adding env vars:**
   - Vercel → Deployments → Click "..." → Redeploy

---

### **Issue 7: JWT Authentication Not Working**

**Error:**
```
{
  "detail": "Authentication credentials were not provided."
}
```

**Cause:** Token not sent or wrong format

**Solution:** Frontend must send token in header:
```javascript
fetch('https://api.vercel.app/api/foodItems/', {
  headers: {
    'Authorization': 'Bearer ' + accessToken  // Space after Bearer!
  }
})
```

---

### **Issue 8: Large Deployment Size**

**Error:**
```
Error: Serverless Function is too large (16mb) - Maximum is 15mb
```

**Causes:**
- Too many dependencies
- Large files included

**Solutions:**

1. **Review requirements.txt:**
   - Remove unused packages
   - Use lighter alternatives

2. **Check .vercelignore:**
   - Make sure you're excluding unnecessary files
   ```
   .venv/
   *.sqlite3
   __pycache__/
   node_modules/
   media/
   staticfiles/
   ```

3. **Use Vercel Pro (allows 50mb):**
   - But usually not needed if properly configured

---

## 🎓 Key Concepts to Remember

### **1. Serverless ≠ Traditional Server**
- No persistent filesystem (can't save uploaded files locally)
- Each request is isolated
- Use external services: Database, file storage (S3), caching (Redis)

### **2. Environment Variables Are Essential**
- NEVER hardcode secrets in code
- Different values for dev/staging/production
- Set in Vercel Dashboard, read with `os.getenv()`

### **3. Database Must Be External**
- SQLite doesn't work (read-only filesystem)
- Use: PostgreSQL (Supabase, Neon), MySQL (PlanetScale)
- Connection string goes in DATABASE_URL env variable

### **4. Python Paths Matter**
- `sys.path` tells Python where to find modules
- Django nested in backend/ requires path setup in index.py
- Wrong path = "Module not found" errors

### **5. WSGI Is the Standard Interface**
- Django uses WSGI (not ASGI for Vercel)
- `get_wsgi_application()` creates the HTTP handler
- Vercel expects a variable named `app`

### **6. CORS Is Required for Separate Frontend**
- Browser security blocks cross-domain requests
- Must explicitly allow in Django settings
- `django-cors-headers` middleware handles this

---

## 📝 Checklist for Next Deployment

```
☐ Create index.py in project root
  ├─ sys.path.insert(0, ...) with correct path
  ├─ os.environ.setdefault() with correct settings module
  └─ app = get_wsgi_application()

☐ Create vercel.json in project root
  ├─ "src": "index.py"
  ├─ "use": "@vercel/python"
  └─ routes to index.py

☐ Create .vercelignore in project root
  ├─ .venv, __pycache__, *.pyc
  ├─ .env, *.sqlite3
  └─ Any large/unnecessary folders

☐ Create requirements.txt in project root
  ├─ django
  ├─ djangorestframework
  ├─ dj-database-url
  ├─ psycopg[binary]
  └─ Other dependencies

☐ Update settings.py
  ├─ SECRET_KEY = os.getenv('SECRET_KEY', ...)
  ├─ DEBUG = os.getenv('DEBUG', 'False') == 'True'
  ├─ ALLOWED_HOSTS with .vercel.app
  ├─ DATABASES with dj_database_url.config()
  ├─ CORS_ALLOW_ALL_ORIGINS or CORS_ALLOWED_ORIGINS
  └─ CSRF_TRUSTED_ORIGINS with Vercel domain

☐ Test locally
  ├─ python -c "from index import app"
  ├─ python manage.py runserver
  └─ curl http://localhost:8000/api/...

☐ Push to GitHub
  ├─ git add .
  ├─ git commit -m "..."
  └─ git push origin main

☐ Deploy to Vercel
  ├─ Import GitHub repo
  ├─ Add environment variables (DATABASE_URL, SECRET_KEY)
  └─ Click Deploy

☐ Verify deployment
  ├─ Check build logs for errors
  ├─ Test API endpoints
  └─ Check database connectivity
```

---

## 🚀 Summary: The Big Picture

```
LOCAL DEVELOPMENT:
You write code → Git commit → GitHub

VERCEL DEPLOYMENT:
GitHub → Vercel detects push → Reads vercel.json → 
Installs dependencies → Creates serverless function → 
Deploys to CDN → Your API is live!

INCOMING REQUEST:
User's browser → Vercel CDN → Serverless function starts → 
index.py loads → Django processes → Database query → 
JSON response → Back to user

KEY FILES:
├─ index.py: Entry point (sets up Django paths)
├─ vercel.json: Tells Vercel how to build & route
├─ requirements.txt: Python dependencies
├─ .vercelignore: What NOT to deploy
└─ settings.py: Django configuration (database, CORS, etc.)

ENVIRONMENT VARIABLES:
Vercel Dashboard → Set DATABASE_URL, SECRET_KEY → 
Django reads via os.getenv() → Secure configuration
```

---

## 🎉 You're Now Ready to Deploy Django to Vercel!

**What You Learned:**
- ✅ How Vercel's serverless platform works
- ✅ Why we need index.py as an entry point
- ✅ How vercel.json configures builds and routes
- ✅ Why environment variables are critical
- ✅ How Django WSGI integrates with Vercel
- ✅ Database configuration for production
- ✅ CORS setup for separate frontend
- ✅ Common issues and how to fix them

**Next Steps:**
1. Deploy your own Django project using this guide
2. Experiment with different configurations
3. Monitor logs in Vercel Dashboard
4. Optimize performance (caching, database indexes)
5. Scale up as your app grows (Vercel handles this automatically!)

**Remember:** Every expert was once a beginner. You now have the knowledge to deploy professional Django backends to Vercel. Practice, experiment, and don't be afraid to break things (that's how we learn)! 🚀

---

**Questions? Review this guide section by section. Each part builds on the previous one.**

Good luck with your deployments! 💪

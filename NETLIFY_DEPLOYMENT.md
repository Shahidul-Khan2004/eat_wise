# 🚀 Deploy EatWise Frontend to Netlify

This guide will help you deploy your EatWise frontend to Netlify.

## 📋 Prerequisites

- GitHub account with your repository pushed
- Netlify account (free tier is sufficient)
- Backend already deployed on Vercel at: `https://eat-wise-silk.vercel.app`

## 🎯 Quick Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Select "GitHub" as your Git provider
   - Authorize Netlify to access your repositories
   - Find and select: `Shahidul-Khan2004/eat_wise`

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: (leave empty - it's a static site)
   Publish directory: . (or leave as default)
   ```

4. **Deploy!**
   - Click "Deploy site"
   - Wait ~1 minute for deployment
   - Your site will be live at: `https://random-name-123.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow instructions to set up your domain

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd frontend

# Deploy
netlify deploy

# For production deployment
netlify deploy --prod
```

## ⚙️ Configuration Files Explained

### `netlify.toml` (in project root)

This file tells Netlify how to handle your deployment:

```toml
[build]
  publish = "frontend"        # Serve files from frontend folder

[[redirects]]
  from = "/*"                  # Catch all routes
  to = "/index.html"           # Redirect to index.html
  status = 200                 # SPA routing (not 301/302)
```

**Why this matters:**
- Ensures `/inventory`, `/profile`, etc. all load `index.html` first
- Prevents 404 errors when users refresh on any page
- Standard configuration for Single Page Applications (SPAs)

## 🔗 API Configuration

All frontend files have been updated to use your Vercel backend:

**Backend URL:** `https://eat-wise-silk.vercel.app/api`

Updated files:
- ✅ `login.js` - Uses `/api/auth/login/`
- ✅ `register.js` - Uses `/api/register/`
- ✅ `profile.js` - Uses `/api/profile/`
- ✅ `inventory.js` - Uses `/api/foodItems/`
- ✅ `resources.js` - Uses `/api/resources/`

## 🔧 After Deployment

### 1. Test Your Deployment

Visit your Netlify URL and test:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ Inventory page loads (requires login)
- ✅ Profile page loads (requires login)

### 2. Check CORS Settings

If you get CORS errors, verify your Django `settings.py` on Vercel:

```python
# Make sure these are set:
CORS_ALLOW_ALL_ORIGINS = True  # Or add specific Netlify domain

# Or for production:
CORS_ALLOWED_ORIGINS = [
    "https://your-site.netlify.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://*.netlify.app",
    "https://*.vercel.app"
]
```

### 3. Update API URL (if backend URL changes)

If you change your Vercel backend URL, update these files:

**Files to update:**
- `frontend/login.js` - Line 14
- `frontend/register.js` - Line 17
- `frontend/profile.js` - Lines 9, 57
- `frontend/inventory.js` - Line 13
- `frontend/resources.js` - Line 6

**Find:** `https://eat-wise-silk.vercel.app`  
**Replace with:** `https://your-new-backend.vercel.app`

## 🌐 How Routing Works

**User visits:** `https://your-site.netlify.app/inventory`

```
1. Netlify receives request for /inventory
   ↓
2. netlify.toml redirect rule catches it
   ↓
3. Returns index.html with status 200
   ↓
4. Browser loads index.html
   ↓
5. (You'd handle route in JS if using a router)
```

**For your current setup:**
- Each page is a separate HTML file
- No client-side routing needed
- Direct navigation works: `/login.html`, `/inventory.html`, etc.

## 🚨 Troubleshooting

### Issue 1: 404 on Page Refresh

**Symptom:** Page loads initially but 404 when refreshed

**Solution:** 
- Check `netlify.toml` exists in project root
- Verify `[[redirects]]` section is correct
- Redeploy after adding netlify.toml

### Issue 2: API Calls Fail

**Error:** `Failed to fetch` or CORS errors

**Solutions:**

1. **Check Network Tab:**
   - Open browser DevTools → Network
   - Verify API URL is correct: `https://eat-wise-silk.vercel.app/api/...`
   - Not: `http://localhost:8000/...`

2. **Verify Backend CORS:**
   - Your Vercel backend must allow Netlify's domain
   - Check `settings.py` CORS configuration
   - Redeploy backend if changed

3. **Check Authentication:**
   - Login first
   - Check localStorage has `accessToken`
   - Token might be expired (5 min lifetime)

### Issue 3: Assets Not Loading

**Symptom:** Images, CSS, or JS files return 404

**Solutions:**
- Verify file paths are relative: `style.css`, not `/style.css`
- Check file names match exactly (case-sensitive)
- Ensure files are in `frontend/` directory

## 📊 Deployment Checklist

Before going live:

```
☐ Test registration (create new account)
☐ Test login (use created account)
☐ Test logout (if implemented)
☐ Test inventory page (requires login)
☐ Test profile page (requires login)
☐ Test all navigation links
☐ Test on mobile (responsive design)
☐ Check browser console for errors
☐ Verify API calls go to Vercel (not localhost)
☐ Test on different browsers (Chrome, Firefox, Safari)
```

## 🎨 Custom Domain Setup

Want a custom domain like `eatwise.com`?

1. **Buy domain** (Namecheap, Google Domains, etc.)

2. **In Netlify:**
   - Site settings → Domain management
   - Add custom domain: `eatwise.com`

3. **Update DNS** (at your domain provider):
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

4. **Wait for DNS** (can take 24-48 hours)

5. **Enable HTTPS** (Netlify does this automatically)

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to GitHub:

```bash
# Make changes to frontend
git add frontend/
git commit -m "Update homepage design"
git push origin master

# Netlify detects push → Builds → Deploys → Live in ~1 min
```

**Build notifications:**
- Check Netlify dashboard → Deploys tab
- See real-time build logs
- Get email notifications (optional)

## 📈 Next Steps

After successful deployment:

1. **Monitor Performance**
   - Netlify Analytics (free tier limited)
   - Google Analytics (add tracking code)

2. **Set Up Forms** (if needed)
   - Netlify Forms (built-in, no backend needed)
   - Contact forms, feedback, etc.

3. **Add Environment Variables** (if needed)
   - Site settings → Environment variables
   - Example: API keys, feature flags

4. **Enable Branch Previews**
   - Every git branch gets its own preview URL
   - Test before merging to master

## 🎉 You're Done!

Your frontend is now live on Netlify, connected to your Vercel backend!

**Your Architecture:**
```
Frontend (Netlify)          Backend (Vercel)           Database (Supabase)
├─ HTML/CSS/JS       →      ├─ Django API       →      ├─ PostgreSQL
├─ Static Assets            ├─ JWT Auth                └─ Tables/Data
└─ User Interface           └─ Business Logic
```

**URLs:**
- Frontend: `https://your-site.netlify.app`
- Backend API: `https://eat-wise-silk.vercel.app/api`
- Admin: `https://eat-wise-silk.vercel.app/admin`

## 📞 Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console (F12)
3. Verify backend is running (visit API URL directly)
4. Review CORS settings in Django

---

**Happy Deploying! 🚀**

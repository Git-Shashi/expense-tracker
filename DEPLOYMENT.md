# Deployment Guide - Render

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas database (already configured)

## Backend Deployment

### 1. Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `expense-tracker-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

### 2. Add Environment Variables
In the **Environment** section, add:

```
MONGO_URI=mongodb+srv://shashibhushan847305_db_user:2IQc2Pe9dC9FQ6ew@cluster0.rni03bu.mongodb.net/?appName=Cluster0
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

**Important**: Update `CORS_ORIGIN` after deploying frontend (Step 3).

### 3. Deploy
- Click **Create Web Service**
- Wait for deployment (3-5 minutes)
- Copy the backend URL (e.g., `https://expense-tracker-api.onrender.com`)

## Frontend Deployment

### 1. Update Frontend Configuration
Before deploying, update the API URL:

**File**: `frontend/.env`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with the URL from backend deployment.

### 2. Create Static Site
1. Go to Render Dashboard
2. Click **New** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `expense-tracker-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3. Add Environment Variables
In the **Environment** section, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 4. Deploy
- Click **Create Static Site**
- Wait for deployment
- Copy the frontend URL

### 5. Update Backend CORS
Go back to backend web service:
1. Navigate to **Environment** tab
2. Update `CORS_ORIGIN` with your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```
3. Click **Save Changes** (will trigger redeploy)

## Testing

1. Visit your frontend URL
2. Test creating an expense
3. Test filtering and sorting
4. Check that data persists after refresh

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after inactivity takes ~30-60 seconds (cold start)
- 750 hours/month free (both services combined)

### Troubleshooting

**Backend won't start:**
- Check logs in Render dashboard
- Verify MongoDB URI is correct
- Ensure `NODE_ENV=production`

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` in frontend env vars
- Check backend `CORS_ORIGIN` matches frontend URL
- Ensure backend is running (check health endpoint: `/health`)

**Database connection issues:**
- Verify MongoDB Atlas network access (allow 0.0.0.0/0 for Render)
- Check database user credentials
- Test connection string locally first

### Custom Domain (Optional)
1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Render.yaml (Alternative - Single Config)

Create `render.yaml` in project root for infrastructure as code:

```yaml
services:
  - type: web
    name: expense-tracker-api
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGO_URI
        sync: false
      - key: CORS_ORIGIN
        sync: false

  - type: web
    name: expense-tracker-frontend
    runtime: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        sync: false
```

Then use **Blueprint** deployment from Render dashboard.

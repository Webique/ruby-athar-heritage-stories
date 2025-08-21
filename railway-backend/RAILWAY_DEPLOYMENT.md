# 🚂 Railway Backend Deployment Guide

## Quick Setup (2 minutes)

### 1. Go to Railway
- Visit [railway.app](https://railway.app)
- Sign in with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### 3. Configure Deployment
- **Root Directory**: `railway-backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Set Environment Variables
Click on your service and go to "Variables" tab:

```bash
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://rubyuser:rubypassword@rubyathar.gz7ym8s.mongodb.net/ruby-heritage?retryWrites=true&w=majority&appName=RubyAthar
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://rubyathar.netlify.app
```

### 5. Deploy
- Railway will automatically deploy
- Get your backend URL (e.g., `https://your-app.railway.app`)

### 6. Update Frontend
In Netlify, set environment variable:
```
VITE_API_URL=https://your-app.railway.app
```

## What Happens Next
1. ✅ Backend deploys automatically
2. ✅ Connects to MongoDB Atlas
3. ✅ API endpoints become available
4. ✅ Frontend can communicate with backend
5. ✅ Admin panel becomes functional

## Troubleshooting
- **Build fails**: Check Node.js version (use 18+)
- **CORS errors**: Verify CORS_ORIGIN matches your Netlify domain
- **Database connection**: Check MongoDB URI format

## Support
Railway provides automatic HTTPS, scaling, and monitoring.
Your backend will be available at: `https://your-app.railway.app`

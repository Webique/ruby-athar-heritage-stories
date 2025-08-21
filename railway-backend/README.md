# 🚂 Ruby Heritage Backend

This folder contains the backend server code for deployment on Railway.

## 🚀 Quick Deploy

1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repo**
3. **Set root directory to**: `railway-backend`
4. **Deploy automatically**

## 📁 Files

- `index.js` - Main server file
- `package.json` - Dependencies and scripts
- `env.example` - Environment variables template
- `RAILWAY_DEPLOYMENT.md` - Detailed deployment guide

## 🔧 Environment Variables

Set these in Railway dashboard:

```bash
PORT=5001
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://rubyathar.netlify.app
```

## 📖 Full Guide

See `RAILWAY_DEPLOYMENT.md` for complete setup instructions.

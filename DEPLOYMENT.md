# 🚀 Netlify Deployment Guide

## Prerequisites
- Netlify account
- Backend server deployed (Heroku, Railway, Render, etc.)
- MongoDB Atlas database

## Frontend Deployment (Netlify)

### 1. Build the Project
```bash
npm run build:prod
```

### 2. Deploy to Netlify
1. **Connect Repository**: Connect your GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
   - Node version: `18`

### 3. Environment Variables
Set these in Netlify dashboard:
```
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Ruby Heritage Stories
VITE_APP_VERSION=1.0.0
```

## Backend Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CORS_ORIGIN=https://your-netlify-domain.netlify.app
git push heroku main
```

### Option 2: Railway
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### Option 3: Render
1. Create new Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy

## Environment Variables Reference

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Ruby Heritage Stories
VITE_APP_VERSION=1.0.0
```

### Backend
```
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] API calls work (check browser console)
- [ ] Admin login works
- [ ] Forms submit successfully
- [ ] Database connections work
- [ ] CORS errors resolved

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGIN in backend
2. **API 404**: Verify VITE_API_URL in frontend
3. **Build Failures**: Check Node version (use 18)
4. **Database Connection**: Verify MongoDB URI

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test backend endpoints directly
4. Check Netlify function logs

## Support
For deployment issues, check:
- Netlify build logs
- Backend server logs
- Browser console errors
- Network tab in DevTools

# 🏛️ Ruby Athar Heritage Stories

A full-stack web application showcasing Saudi Arabia's cultural heritage through interactive tours and experiences.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start frontend (port 8080)
npm run dev

# Start backend (port 5001)
npm run server

# Start both frontend and backend
npm run dev:full
```

### Production Build
```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview

# Check deployment readiness
npm run deploy:check
```

## 🌐 Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Configure environment variables (see `.env.production`)

### Backend (Heroku/Railway/Render)
1. Deploy `server/` folder to your preferred platform
2. Set environment variables (see `DEPLOYMENT.md`)
3. Update `VITE_API_URL` in frontend environment

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   └── assets/           # Images and static files
├── server/                # Backend server
│   └── index.js          # Express server
├── dist/                  # Production build (generated)
├── netlify.toml          # Netlify configuration
└── DEPLOYMENT.md          # Detailed deployment guide
```

## 🔧 Environment Variables

### Frontend
```bash
VITE_API_URL=http://localhost:5001          # Development
VITE_API_URL=https://your-backend.com      # Production
```

### Backend
```bash
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-frontend.netlify.app
```

## 🗄️ Database

- **MongoDB Atlas** for production
- Collections: `users`, `bookings`, `contacts`
- Automatic indexing and validation

## 🔐 Authentication

- JWT-based authentication
- Admin panel access control
- Secure password hashing with bcrypt

## 📱 Features

- **Multilingual**: Arabic and English support
- **Responsive Design**: Mobile-first approach
- **Admin Panel**: Manage bookings and contacts
- **Booking System**: Trip reservations with pricing
- **Contact Forms**: Customer inquiries
- **Image Gallery**: Heritage site showcases

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: JWT, bcrypt
- **Deployment**: Netlify (frontend), Heroku/Railway (backend)

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](server/README.md) - Backend API endpoints
- [Component Library](src/components/README.md) - UI components

## 🚀 Live Demo

- **Frontend**: [Your Netlify URL]
- **Admin Panel**: [Your Netlify URL]/admin/login
- **Credentials**: Set via environment variables (see .env.example)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for Saudi Arabia's cultural heritage
# Trigger Render deployment

# Ruby Heritage Stories - Full Stack Application

A modern, bilingual (English/Arabic) cultural heritage tourism website with a complete backend system for managing bookings and contacts.

## 🚀 Features

### Frontend
- **Bilingual Support**: English and Arabic with RTL support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Built with React, TypeScript, and shadcn/ui components
- **Cultural Experiences**: Interactive tour booking system
- **Contact Forms**: Integrated with backend API
- **Admin Panel**: Protected dashboard for managing bookings and contacts

### Backend
- **Express.js Server**: RESTful API with middleware
- **MongoDB Database**: NoSQL database for data persistence
- **Authentication**: JWT-based admin authentication
- **Email Notifications**: Automated email system for bookings and contacts
- **File Upload**: Image upload functionality
- **Data Validation**: Input validation and error handling

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + shadcn/ui
- React Router DOM
- React Hook Form + Zod validation
- TanStack Query

### Backend
- Node.js + Express.js
- MongoDB (with Mongoose-like operations)
- JWT Authentication
- Nodemailer (Email service)
- Multer (File uploads)
- CORS enabled

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email notifications)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend and backend dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env

# Edit with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ruby-heritage

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@rubyheritage.com

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS (using Homebrew)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 4. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### 5. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
# Start both frontend and backend concurrently
npm run dev:full
```

#### Separate Mode
```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend development server
npm run dev
```

## 📱 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin/dashboard

## 🔐 Admin Access

**Default Credentials:**
- Username: `rubyuser`
- Password: `rubypassword`

## 🗄️ Database Collections

The application automatically creates these collections:

- **users**: Admin user accounts
- **bookings**: Tour booking submissions
- **contacts**: Contact form submissions

## 📧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form
- `POST /api/bookings` - Submit booking form
- `POST /api/auth/login` - Admin authentication

### Protected Endpoints (Admin Only)
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/contacts` - Get all contacts
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `POST /api/upload` - File upload

## 🎨 Customization

### Adding New Tours
1. Update the `trips` array in `src/pages/Journey.tsx`
2. Add tour images to `src/assets/gallery/`
3. Update pricing and details as needed

### Modifying Email Templates
Edit email templates in `server/index.js`:
- Customer confirmation emails
- Admin notification emails
- Contact form notifications

### Styling
- Main styles: `src/index.css`
- Component styles: Tailwind CSS classes
- Custom CSS variables: `tailwind.config.ts`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the `dist` folder
```

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy `server/` folder
3. Update frontend API URL

### Database
- Use MongoDB Atlas for production
- Set up proper indexes
- Configure backup strategies

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Check connection string
echo $MONGODB_URI
```

#### Email Not Sending
- Verify Gmail credentials
- Check 2FA is enabled
- Verify app password is correct

#### CORS Issues
- Check `CORS_ORIGIN` in `.env`
- Ensure frontend URL matches

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run server
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [JWT Authentication](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: atharruby@outlook.com
- Phone: +966 57 360 0158

---

**Built with ❤️ for preserving Arabian heritage and culture**

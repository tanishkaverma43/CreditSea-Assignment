# CreditSea - Loan Management System

A comprehensive, full-stack loan management application built with modern web technologies.

## 🚀 Features

- **User Authentication**: Secure login/registration system with JWT tokens
- **Role-based Access**: Admin and Verifier roles with different permissions
- **Loan Management**: Complete loan application lifecycle management
- **Dashboard Analytics**: Real-time statistics and insights
- **Modern UI**: Beautiful, responsive interface with TailwindCSS
- **Real-time Updates**: Live data updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CreditSea
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create backend .env file
   cd ../backend
   echo "MONGODB_URI=mongodb://localhost:27017/creditsea
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key" > .env
   ```

4. **Start the application**
   ```bash
   # Start the backend (from backend directory)
   npm run dev
   
   # Start the frontend (from frontend directory)
   npm run dev
   ```

5. **Seed initial data**
   ```bash
   # Create default users (from backend directory)
   npm run seed
   ```

## 🔐 Default Users

After running the seed script, you can login with:

### Admin User
- **Email**: `admin@creditsea.com`
- **Password**: `admin123`
- **Role**: Full system access

### Verifier User
- **Email**: `verifier@creditsea.com`
- **Password**: `verifier123`
- **Role**: Loan verification access

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📱 Features Overview

### Dashboard
- Real-time statistics
- Loan application overview
- User management (Admin only)
- Analytics and reporting

### Loan Management
- Submit new loan applications
- Review and verify applications
- Approve/reject loans
- Track application status

### User Management
- Role-based access control
- User registration and authentication
- Profile management
- Admin user management

## 🎨 Design

The application features a modern, professional design with:
- Custom green color scheme (#0A512FE8)
- Responsive layout
- Clean typography
- Intuitive navigation
- Professional dashboard interface

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed initial data

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

---

**CreditSea** - Streamlining loan management for the modern world.

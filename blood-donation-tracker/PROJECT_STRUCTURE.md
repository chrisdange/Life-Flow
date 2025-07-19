# Project Structure

## Overview
This document outlines the structure and organization of the Digital Blood Donation Tracker project.

## Directory Structure

```
blood-donation-tracker/
├── public/                     # Static assets
│   └── vite.svg               # Vite logo
├── src/                       # Source code
│   ├── components/            # Reusable React components
│   │   ├── Navbar.jsx        # Navigation bar with auth
│   │   └── AuthModal.jsx     # Authentication modal
│   ├── pages/                 # Page components
│   │   └── Home.jsx          # Homepage with hero, stats, inventory
│   ├── lib/                   # Utility libraries
│   │   └── supabase.js       # Supabase client and helper functions
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles (Tailwind)
├── database/                  # Database schema and sample data
│   ├── schema.sql            # Complete database schema
│   └── sample-data.sql       # Sample data for testing
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite build configuration
└── README.md                 # Project documentation
```

## Key Components

### Frontend Components

1. **Navbar.jsx**
   - Navigation menu
   - Authentication modal trigger
   - Responsive design

2. **AuthModal.jsx**
   - Sign in/Sign up functionality
   - Supabase authentication integration
   - Form validation

3. **Home.jsx**
   - Hero section
   - Statistics display
   - Blood inventory overview
   - Urgent requests section

### Backend Integration

1. **supabase.js**
   - Supabase client configuration
   - Authentication helpers
   - Database operation helpers
   - Environment variable integration

### Database Schema

1. **schema.sql**
   - Complete database structure
   - Row Level Security (RLS) policies
   - Triggers and functions
   - Indexes for performance

2. **sample-data.sql**
   - Test data for development
   - Sample hospitals, donors, donations
   - Blood inventory and requests

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

## Development Workflow

1. **Setup**
   - Clone repository
   - Install dependencies with `npm install`
   - Set up Supabase project
   - Configure environment variables
   - Run database schema

2. **Development**
   - Start dev server with `npm run dev`
   - Access at `http://localhost:5173`
   - Hot reload enabled

3. **Database**
   - Use Supabase dashboard for data management
   - Run SQL scripts in Supabase SQL editor
   - Monitor real-time subscriptions

## Next Steps for Development

### Immediate Tasks
1. Set up Supabase project
2. Configure environment variables
3. Run database schema
4. Test authentication flow

### Feature Development Priority
1. User authentication and profiles
2. Donor registration system
3. Hospital dashboard
4. Donation tracking
5. Real-time notifications
6. Blood inventory management

### Advanced Features
1. Geolocation services
2. SMS/Email notifications
3. Analytics dashboard
4. Mobile responsiveness
5. PWA capabilities

## Collaboration Guidelines

1. **Code Organization**
   - Keep components small and focused
   - Use descriptive naming conventions
   - Maintain consistent file structure

2. **Git Workflow**
   - Use feature branches
   - Write meaningful commit messages
   - Review code before merging

3. **Documentation**
   - Update README for new features
   - Document API changes
   - Maintain this structure guide

## Environment Setup

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
1. Run `npm run build`
2. Deploy `dist/` folder to hosting provider
3. Configure environment variables on host

This structure provides a solid foundation for collaborative development while maintaining scalability and code organization.

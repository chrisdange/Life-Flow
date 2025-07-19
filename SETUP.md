# LifeFlow - Setup Guide for Collaborators

Welcome to the LifeFlow blood donation tracker project! This guide will help you get the project running on your local machine.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chrisdange/Life-Flow.git
cd Life-Flow
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Dependencies for Each Application

```bash
# Install dependencies for the main user application
cd blood-donation-tracker
npm install
cd ..

# Install dependencies for the admin application
cd lifeflow-admin
npm install
cd ..
```

### 4. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your database credentials and API keys:
   ```env
   # Database
   DATABASE_URL="your_supabase_database_url"
   
   # Add other environment variables as needed
   ```

### 5. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if any)
npx prisma db push
```

### 6. Test the Setup

```bash
# Test database connection
node test-connections.js
```

## Running the Applications

### Main User Application (Port 5173)
```bash
cd blood-donation-tracker
npm run dev
```

### Admin Application (Port 5174)
```bash
cd lifeflow-admin
npm run dev
```

## Project Structure

```
Life-Flow/
├── blood-donation-tracker/    # Main user-facing application
├── lifeflow-admin/           # Admin dashboard
├── prisma/                   # Database schema and migrations
├── .env                      # Environment variables (not tracked)
├── .env.example             # Environment variables template
└── package.json             # Root dependencies
```

## Development Workflow

### Before Making Changes
1. Pull the latest changes: `git pull`
2. Create a new branch: `git checkout -b feature/your-feature-name`

### Making Changes
1. Make your changes
2. Test your changes locally
3. Commit your changes: `git commit -m "Description of changes"`
4. Push your branch: `git push origin feature/your-feature-name`
5. Create a Pull Request on GitHub

### Best Practices
- Always work on feature branches, never directly on `main`
- Write descriptive commit messages
- Test your changes before pushing
- Keep your `.env` file private and never commit it

## Troubleshooting

### Common Issues

1. **Node modules not found**: Run `npm install` in the appropriate directory
2. **Database connection issues**: Check your `.env` file and database credentials
3. **Port already in use**: Make sure no other applications are running on ports 5173 or 5174

### Getting Help

If you encounter any issues:
1. Check this setup guide first
2. Look at the project's README files in each directory
3. Ask your project partner for help
4. Check the GitHub Issues page

## Contributing

We welcome contributions! Please:
1. Follow the development workflow above
2. Write clear commit messages
3. Test your changes thoroughly
4. Update documentation if needed

Happy coding! 🚀

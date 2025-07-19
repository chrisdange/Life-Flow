# 🩸 LifeFlow

A modern blood donation tracking platform that connects donors with hospitals and tracks donation history, eligibility dates, and urgent blood needs to save lives.

## 🚀 Features

- **Donor Management**: Register donors, track donation history, and manage eligibility dates
- **Hospital Dashboard**: Hospital interface for managing blood requests and inventory
- **Real-time Updates**: Live notifications for urgent blood needs
- **Blood Inventory Tracking**: Monitor blood type availability across different locations
- **Geolocation Support**: Find nearby donation centers and hospitals
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn
- Supabase account

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd blood-donation-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your Supabase credentials

4. **Set up the database**

   - Run the SQL scripts in the `database/` folder in your Supabase SQL editor
   - This will create the necessary tables and relationships

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📊 Database Schema

The application uses the following main tables:

- `users` - User authentication and basic info
- `donors` - Donor-specific information (blood type, medical history)
- `hospitals` - Hospital information and contact details
- `donations` - Record of all blood donations
- `blood_requests` - Urgent blood needs from hospitals
- `blood_inventory` - Current blood stock levels

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Development Guidelines

- Use functional components with hooks
- Follow the existing code structure and naming conventions
- Write meaningful commit messages
- Test your changes before submitting PRs
- Update documentation when adding new features

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Features Roadmap

- [ ] User authentication (donors, hospitals, admins)
- [ ] Donor registration and profile management
- [ ] Hospital dashboard for blood requests
- [ ] Real-time notifications for urgent needs
- [ ] Donation scheduling system
- [ ] Blood inventory management
- [ ] Geolocation-based donor matching
- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Analytics dashboard for administrators

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for saving lives through technology**

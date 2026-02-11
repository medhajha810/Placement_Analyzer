# PathFinder - Smart Placement Companion

Your AI-powered placement companion connecting students with dream jobs and helping companies find top talent.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## 🚀 Quick Start

Get PathFinder running in 5 minutes:

```bash
# 1. Clone and install
pnpm install

# 2. Setup environment
cp .env.example .env.local
# Add your Supabase credentials

# 3. Run
pnpm dev

# Visit http://localhost:3000
```

**Full guide**: See [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | Get running in 5 minutes |
| **[SETUP.md](SETUP.md)** | Complete setup & configuration |
| **[FEATURES.md](FEATURES.md)** | Detailed feature overview |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design & data flow |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | What's been built |

---

## ✨ Features

### For Students
- 📋 **Dashboard**: Track all applications in a Kanban board
- 🔍 **Job Discovery**: Browse AI-matched opportunities with 1-click filtering
- 📊 **Skill Analysis**: Get AI-recommended skills to improve for your dream role
- 💼 **Company Insights**: Explore company profiles and hiring trends
- ✅ **Eligibility Checker**: Instantly know if you match the job requirements

### For Companies
- 📢 **Post Jobs**: Create and manage job postings easily
- 👥 **Candidate Pipeline**: Manage candidates through interview stages
- 📈 **Analytics**: Track applications, hiring progress, and key metrics
- 🤖 **AI Matching**: Get candidates ranked by skill match percentage
- 📊 **Insights**: Visualize hiring trends and performance

---

## 🏗️ Architecture

**Frontend**: Next.js 16 + React 19.2 + TypeScript + Tailwind CSS
**Backend**: Supabase (PostgreSQL) + REST API
**Components**: 50+ shadcn/ui components
**Deployment**: Vercel ready

```
Landing Page (Public)
    ↓
Auth System (Sign up / Sign in)
    ├── Student Portal
    │   ├── Dashboard (Kanban board)
    │   └── Job Listings (Search & browse)
    └── Company Portal
        ├── HR Dashboard (Analytics)
        └── Candidate Management
```

---

## 📁 Project Structure

```
pathfinder/
├── app/                        # Next.js app router
│   ├── api/                   # Backend API routes
│   ├── auth/                  # Auth pages
│   ├── student/               # Student portal
│   ├── company/               # Company portal
│   └── page.tsx               # Landing page
│
├── components/                # Reusable UI components
│   ├── student-dashboard.tsx  # Kanban board
│   ├── company-dashboard.tsx  # HR analytics
│   ├── job-listings.tsx       # Job search
│   └── ui/                    # 50+ shadcn components
│
├── lib/                       # Utilities
│   └── auth.ts               # Auth helpers
│
├── scripts/                   # Database setup
│   └── 01-create-schema.sql  # PostgreSQL schema
│
└── docs/                      # Documentation
    ├── SETUP.md              # Full setup guide
    ├── FEATURES.md           # Feature details
    └── ARCHITECTURE.md       # System design
```

---

## 🎯 Core Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing page | Public |
| `/auth/signup` | Create account | Public |
| `/auth/signin` | Sign in | Public |
| `/student/dashboard` | Application tracker | Students |
| `/student/jobs` | Job listings | Students |
| `/company/dashboard` | HR dashboard | Companies |

---

## 🗄️ Database

**Tables**: 7 main tables with relationships
- `users` - User accounts with roles
- `students` - Student profiles
- `companies` - Company information
- `job_postings` - Job listings
- `applications` - Job applications
- `skill_gaps` - AI skill analysis
- `eligibility_checks` - Job requirements

**Security**: Row-level security (RLS) policies enabled

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get these from your Supabase project dashboard under Settings > API.

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com and import repository
# 3. Add environment variables
# 4. Deploy!
```


## 🛠️ Development

### Tech Stack
- **Framework**: Next.js 16 (React 19.2)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

### Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## 🔐 Security Features

- ✅ Supabase Auth (enterprise-grade)
- ✅ Password hashing (bcrypt)
- ✅ Row-level security (RLS)
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure session management
- ✅ HTTPS only

---

## 📱 Responsive Design

- ✅ Mobile optimized (320px+)
- ✅ Tablet friendly (768px+)
- ✅ Desktop full-featured (1024px+)
- ✅ Touch-friendly UI elements
- ✅ Fast performance on all devices

---

## 🎨 Design System

**Color Palette**:
- Primary: Blue (#3b82f6)
- Dark backgrounds: Slate (#1e293b)
- Accents: Green, Purple, Yellow

**Typography**: 2 font families (Geist Sans, Geist Mono)

**Components**: Consistent with shadcn/ui design system

---

## 📊 Analytics & Charts

- Real-time analytics dashboard
- Application trends visualization
- Hiring progress tracking
- Candidate match distribution
- Custom date range selection

---

## 🚨 Troubleshooting

**Issue**: Environment variables not set
**Solution**: Create `.env.local` with Supabase credentials

**Issue**: Database connection error
**Solution**: Verify Supabase project is active and credentials are correct

**Issue**: Cannot find modules
**Solution**: Run `pnpm install` to install dependencies

See [SETUP.md](SETUP.md) for more troubleshooting tips.

---



## 📖 API Reference

### Authentication
```
POST /api/auth/signup     - Create account
POST /api/auth/signin     - Sign in
```

### Jobs
```
GET  /api/jobs            - List all jobs
POST /api/jobs            - Create new job
```

### Applications
```
GET    /api/applications  - Get applications
POST   /api/applications  - Submit application
PATCH  /api/applications  - Update status
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed API docs.

---

## 💡 Use Cases

**For Students**:
1. Sign up and create profile
2. Browse AI-matched jobs
3. Apply for opportunities
4. Track applications in dashboard
5. Get interview notifications
6. Receive offers

**For Companies**:
1. Post job openings
2. Receive applications from qualified candidates
3. Screen and interview candidates
4. Make offers
5. Track hiring metrics
6. Build teams

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing`)
6. Open a pull request

---

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

## 🆘 Support & Help

- 📖 Check [SETUP.md](SETUP.md) for detailed setup help
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- ✨ Explore [FEATURES.md](FEATURES.md) for feature details
- 🚀 Quick start? See [QUICKSTART.md](QUICKSTART.md)

---

## ⭐ Made with

- ❤️ Next.js & React
- 🔐 Supabase
- 🎨 Tailwind CSS
- 📦 shadcn/ui
- 📈 Recharts
- 🚀 Vercel

---

## 🎉 You're All Set!

PathFinder is ready to transform the placement experience. Whether you're a student seeking your dream job or a company finding top talent, PathFinder has you covered.

**Start building amazing careers today!** ✨

---

**Questions?** Check the documentation files or create an issue on GitHub.

**Happy coding!** 🚀

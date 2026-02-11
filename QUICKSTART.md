# PathFinder - Quick Start Guide

Get PathFinder running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- pnpm or npm
- A Supabase account (free tier works great!)

## Step 1: Get Your Supabase Keys (2 min)

1. Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to **Settings → API**
4. Copy your:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Public Anon Key

## Step 2: Setup Environment (1 min)

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local and paste your Supabase keys:
# NEXT_PUBLIC_SUPABASE_URL=your_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## Step 3: Install & Run (2 min)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## Step 4: Test the App

### Try as Student:
1. Click "Get Started" → Select "Student"
2. Sign up with email/password
3. You're in the dashboard!
4. Click "For Students" to browse jobs

### Try as Company:
1. Go back to sign up
2. Select "Company" role
3. View company dashboard with analytics

## Default Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/auth/signup` | Sign up |
| `/auth/signin` | Sign in |
| `/student/dashboard` | Student dashboard |
| `/student/jobs` | Browse jobs |
| `/company/dashboard` | Company HR dashboard |

## Key Features to Explore

✅ **Landing Page**
- Modern hero section
- Feature highlights

✅ **Authentication**
- Email/password signup
- Role selection (student/company)
- Sign in

✅ **Student Features**
- Kanban board for applications
- Job search and filtering
- Skill gap recommendations
- Company insights

✅ **Company Features**
- Post job listings
- View candidates
- Analytics dashboards
- Hiring pipeline

## File Locations

```
Core Logic:
- lib/auth.ts → Authentication utilities
- app/api/ → Backend endpoints

UI Components:
- components/student-dashboard.tsx
- components/company-dashboard.tsx
- components/job-listings.tsx
- components/ui/* → Shared UI components

Pages:
- app/page.tsx → Landing page
- app/auth/signup/page.tsx → Sign up
- app/student/dashboard/page.tsx → Student dashboard
```

## Troubleshooting

**"Cannot find module '@supabase/supabase-js'"**
```bash
pnpm install
```

**"Environment variables not set"**
- Check .env.local exists
- Verify NEXT_PUBLIC_SUPABASE_URL is set
- Restart dev server after changes

**"Database connection error"**
- Verify Supabase project is active
- Check API keys are correct
- Ensure RLS policies are configured

## What's Pre-built

✅ Database schema with 7 tables
✅ User authentication system
✅ Complete UI with 50+ components
✅ API endpoints for jobs/applications
✅ Kanban board for applications
✅ Analytics charts
✅ Job search with filtering
✅ Responsive design

## Next: Customize

1. **Update Colors**: Edit `tailwind.config.ts`
2. **Add More Fields**: Modify `scripts/01-create-schema.sql`
3. **Change Copy**: Update component text
4. **Add Features**: Create new API routes in `app/api/`

## Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial PathFinder deployment"
git push origin main

# Go to vercel.com → Import repository
# Add environment variables
# Deploy!
```

## Need Help?

1. Check `SETUP.md` for detailed documentation
2. Review `PROJECT_SUMMARY.md` for feature overview
3. Check components for implementation examples
4. Run `pnpm dev` in verbose mode for debugging

---

**That's it! PathFinder is now running locally.** 🎉

Build amazing! ✨

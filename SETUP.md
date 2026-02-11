# PathFinder - Smart Placement Companion

A comprehensive AI-powered placement companion platform connecting students with their dream jobs and helping companies find top talent.

## Features

### For Students
- **Real-time Job Matching**: Get instant notifications for jobs matching your skills
- **Application Tracking**: Manage all applications in a unified kanban board
- **Skill Gap Analysis**: AI-powered recommendations for improvement
- **Company Insights**: Detailed company profiles and hiring trends
- **Eligibility Checker**: Check if you meet company requirements

### For Companies
- **Job Posting Management**: Create and manage job postings
- **Candidate Matching**: AI-matched candidates ranked by fit
- **Analytics Dashboard**: Track applications and hiring progress
- **Candidate Pipeline**: Manage candidates through interview stages

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **UI Library**: shadcn/ui

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd pathfinder

# Install dependencies
pnpm install
# or
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your API keys from the project settings
3. The database schema has already been created via `scripts/01-create-schema.sql`

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials from the Settings > API page.

### 4. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pathfinder/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── applications/
│   │   └── jobs/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── student/
│   │   ├── dashboard/
│   │   └── jobs/
│   ├── company/
│   │   └── dashboard/
│   ├── layout.tsx
│   ├── page.tsx (Landing page)
│   └── globals.css
├── components/
│   ├── auth-signin.tsx
│   ├── auth-signup.tsx
│   ├── student-dashboard.tsx
│   ├── company-dashboard.tsx
│   ├── job-listings.tsx
│   └── ui/ (shadcn/ui components)
├── lib/
│   └── auth.ts (Authentication utilities)
├── scripts/
│   └── 01-create-schema.sql (Database schema)
├── public/
├── package.json
└── README.md
```

## Key Routes

### Public Routes
- `/` - Landing page
- `/auth/signup` - Sign up page
- `/auth/signin` - Sign in page

### Student Routes
- `/student/dashboard` - Application tracking dashboard
- `/student/jobs` - Browse available jobs

### Company Routes
- `/company/dashboard` - Manage job postings and candidates

## Database Schema

The application uses the following main tables:

- **auth.users** - User authentication (managed by Supabase Auth)
- **users** - Extended user information with roles
- **students** - Student profiles with skills and experience
- **companies** - Company profiles
- **job_postings** - Job listings
- **applications** - Job applications
- **skill_gaps** - AI-identified skill gaps
- **eligibility_checks** - Eligibility criteria and checks

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job posting

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit application
- `PATCH /api/applications` - Update application status

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
5. Deploy

### Deploy with Docker

```bash
docker build -t pathfinder .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=xxx -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx pathfinder
```

## Future Enhancements

- [ ] Resume parsing and skill extraction
- [ ] AI-powered resume matching
- [ ] Real-time job scraping from multiple sources
- [ ] Video interview integration
- [ ] Salary negotiation assistant
- [ ] Placement analytics and insights
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced filtering and search
- [ ] Company reviews and ratings

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
Make sure your `.env.local` file contains the correct Supabase URL and keys.

### Database connection errors
Verify that:
1. Your Supabase project is active
2. The database tables have been created (run `scripts/01-create-schema.sql`)
3. Your Supabase API keys are correct
4. Row Level Security (RLS) policies are properly configured

### CORS issues
If you encounter CORS errors when calling APIs:
1. Check your Supabase dashboard for CORS settings
2. Add your domain to the allowed origins
3. Ensure API endpoints are properly configured

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact support at support@pathfinder.app

---

**PathFinder** - Your Smart Placement Companion ✨

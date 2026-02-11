# 🚀 Getting Started with the Advanced Placement Portal

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- API keys:
  - Gemini API (for AI features)
  - RapidAPI key (for job scraping - optional)
  - Speech-to-text API (for voice interviews - optional)

## Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

## Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/placement_portal

# AI APIs
GEMINI_API_KEY=your_gemini_api_key
RAPIDAPI_KEY=your_rapidapi_key

# Authentication (implement as needed)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Optional APIs
SPEECH_TO_TEXT_API_KEY=your_stt_key
SENTIMENT_ANALYSIS_API_KEY=your_sentiment_key
```

## Database Setup

```bash
# Run the schema creation script
psql -U your_username -d placement_portal -f scripts/01-create-schema.sql

# Or use a database migration tool like Prisma
# npx prisma migrate dev
```

## Running the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

The application will be available at `http://localhost:3000`

## Default Routes

- `/` - Landing page
- `/auth/signin` - Sign in
- `/auth/signup` - Sign up
- `/admin/dashboard` - Admin panel (requires admin role)
- `/student/dashboard` - Student dashboard
- `/company/dashboard` - Company portal

## First Steps

### 1. Create Admin Account
Sign up with email and manually update the role to 'admin' in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

### 2. Add First Company & Drive
- Login as admin
- Go to Admin Dashboard
- Click "Create Drive" tab
- Fill in company and job details
- Click "Create Placement Drive"

### 3. Student Registration
- Students sign up with their email
- Complete profile with resume, GPA, skills
- Browse available drives
- Register for drives

### 4. Explore Features

#### For Students:
1. **Check PRS Score**: View your Placement Readiness Score on dashboard
2. **Set Dream Companies**: Go to "Dream Companies" tab and add target companies
3. **Take Mock Interview**: Generate questions based on a drive and record answers
4. **Browse Jobs**: Check real-time scraped jobs
5. **View Analytics**: See your performance over time with filters

#### For Admins:
1. **What-If Simulator**: Test different eligibility criteria to forecast eligible students
2. **View Analytics**: Check at-risk students and drive statistics
3. **Manage Drives**: Update drive status, view registrations
4. **Forecasting**: See predictive analytics for upcoming drives

## API Integration Guide

### Job Scraping Setup

To enable real-time job scraping, sign up for RapidAPI and get the JSearch API key:

```typescript
// app/api/jobs/scrape/route.ts
const response = await fetch(
  `https://jsearch.p.rapidapi.com/search?query=${keywords}`,
  {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  }
);
```

### AI Integration (Gemini)

For resume analysis and question generation:

```bash
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Generate interview questions
const prompt = `Based on this JD: ${jdText} and resume: ${resume}, generate 10 interview questions...`;
const result = await model.generateContent(prompt);
```

### Voice Interview Setup

For AI voice analysis in mock interviews:

```bash
npm install @google-cloud/speech
npm install @google-cloud/language
```

## Testing Features

### Test Admin Features
```bash
# Access admin dashboard
http://localhost:3000/admin/dashboard

# Test what-if simulator
- Adjust GPA slider
- Click "Run Simulation"
- Observe eligible student count changes
```

### Test Student Features
```bash
# Access student dashboard
http://localhost:3000/student/dashboard

# Test mock interview
- Click "Take Mock Interview"
- Generate questions for a drive
- Record/type answers
- Submit for AI feedback
```

## Data Population (Optional)

To test with sample data, run:

```sql
-- Insert sample students
INSERT INTO users (email, password_hash, full_name, role)
VALUES 
  ('student1@example.com', 'hash', 'John Doe', 'student'),
  ('student2@example.com', 'hash', 'Jane Smith', 'student');

-- Insert sample companies
INSERT INTO companies (name, description, industry)
VALUES 
  ('Google', 'Tech giant', 'Technology'),
  ('Microsoft', 'Software company', 'Technology');

-- See more in scripts/02-sample-data.sql (create this file as needed)
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U your_username -d placement_portal -c "SELECT 1;"
```

### API Rate Limits
- Free RapidAPI plans have rate limits
- Cache scraped jobs to reduce API calls
- Consider paid plans for production

### Performance Issues
- Ensure database indexes are created
- Use connection pooling for database
- Enable caching for frequently accessed data

## Production Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Production
Add all `.env.local` variables to your hosting platform's environment settings.

### Database
- Use managed PostgreSQL (e.g., Supabase, Neon, AWS RDS)
- Enable connection pooling
- Set up regular backups

### Scheduled Jobs (Job Scraping)
Use Vercel Cron or similar for automated job scraping:

```typescript
// app/api/cron/scrape-jobs/route.ts
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Run scraping
  await scrapeJobs();
  return NextResponse.json({ success: true });
}
```

## Next Steps

1. **Implement Authentication**: Use NextAuth.js for complete auth flow
2. **Add Charts**: Integrate Recharts for analytics visualization
3. **Email Notifications**: Set up SendGrid or similar for email alerts
4. **Mobile Responsive**: Ensure all pages work well on mobile
5. **Testing**: Add unit tests with Jest and E2E tests with Playwright
6. **Documentation**: Create API documentation with Swagger

## Support & Contribution

For issues or features:
1. Create an issue on GitHub
2. Fork and submit pull request
3. Follow code style guidelines

## License

MIT License - feel free to use and modify!

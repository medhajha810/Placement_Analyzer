# 🎯 Additional NPM Packages to Install

To enable all AI and advanced features, install these additional packages:

## Core Dependencies

```bash
# AI Integration
pnpm add @google/generative-ai

# Date handling (already using date-fns, just ensure it's there)
pnpm add date-fns

# Charts and visualization (for analytics)
pnpm add recharts

# For audio/video processing (mock interviews)
pnpm add @google-cloud/speech @google-cloud/language

# For better forms
pnpm add react-hook-form zod

# For markdown rendering (if needed for JD/descriptions)
pnpm add react-markdown

# For calendar features
pnpm add react-day-picker

# For toasts/notifications
pnpm add sonner
```

## Dev Dependencies

```bash
pnpm add -D @types/node @types/react @types/react-dom
```

## Environment Variables (.env.local)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/placement_portal

# AI APIs
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_key_here  # Alternative to Gemini

# Job Scraping
RAPIDAPI_KEY=your_rapidapi_key_here

# Speech-to-Text (for voice mock interviews)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# YouTube Data API (for fetching video metadata)
YOUTUBE_API_KEY=your_youtube_api_key
```

## Quick Setup Guide

### 1. Get Gemini API Key (Free Tier)
```
1. Go to https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Copy the key to your .env.local
```

### 2. Get RapidAPI Key (Job Scraping)
```
1. Go to https://rapidapi.com/
2. Sign up for free account
3. Subscribe to JSearch API (free tier available)
4. Copy API key to .env.local
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb placement_portal

# Run schema
psql -d placement_portal -f scripts/01-create-schema.sql

# Or use Supabase (free tier)
# Just update DATABASE_URL with Supabase connection string
```

### 4. Install All Dependencies
```bash
pnpm install
```

### 5. Run Development Server
```bash
pnpm dev
```

## Optional: Production Setup

### Using Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Using Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Database Options
- **Supabase**: Free PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Railway**: Easy deployment
- **AWS RDS**: Enterprise option

## API Rate Limits (Free Tiers)

| Service | Free Tier Limit | Use Case |
|---------|----------------|----------|
| Gemini API | 60 requests/min | AI features |
| RapidAPI JSearch | 500 requests/month | Job scraping |
| Google Speech-to-Text | 60 min/month | Voice interviews |

## Recommended Production Stack

```
Frontend: Vercel (Free)
Database: Supabase (Free 500MB)
AI: Gemini API (Free tier)
Job Scraping: RapidAPI (Free tier)
Email: Resend (Free 3000/month)
```

Total monthly cost: **$0 for MVP** 🎉

## Testing Locally

```bash
# 1. Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# 2. Test API endpoints
curl http://localhost:3000/api/admin/dashboard

# 3. Test AI integration
# Add a test route in your API to verify Gemini works

# 4. Check build
pnpm build
```

## Common Issues & Solutions

### Issue: Can't connect to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection string
psql "postgresql://user:pass@host:5432/dbname"
```

### Issue: Gemini API not working
```javascript
// Test your API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent("Hello");
console.log(result.response.text());
```

### Issue: Job scraping returns empty
- Check RapidAPI subscription is active
- Verify API key in .env.local
- Check rate limits

## Performance Tips

1. **Enable caching** for scraped jobs (1 hour)
2. **Use connection pooling** for database
3. **Implement pagination** for large lists
4. **Lazy load** components
5. **Use indexes** on frequently queried columns

## Security Checklist

- [ ] Never commit .env.local
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting on APIs
- [ ] Validate all user inputs
- [ ] Sanitize SQL queries
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Add authentication middleware

---

## You're All Set! 🚀

Your placement portal is now ready to deploy with all advanced features enabled!

# PathFinder - Vercel Deployment Guide

**Deployment Date**: February 11, 2026 | **Platform**: Vercel

---

## 📋 Deployment Checklist

- [ ] **Step 1**: Push code to GitHub repository
- [ ] **Step 2**: Create Vercel account & connect GitHub
- [ ] **Step 3**: Set up environment variables
- [ ] **Step 4**: Configure Supabase credentials
- [ ] **Step 5**: Configure Google Gemini API key
- [ ] **Step 6**: Deploy to Vercel
- [ ] **Step 7**: Test production deployment
- [ ] **Step 8**: Configure custom domain (optional)
- [ ] **Step 9**: Set up monitoring & analytics
- [ ] **Step 10**: Create CI/CD pipeline

---

## ✅ STEP 1: PUSH CODE TO GITHUB

### 1A. Create GitHub Repository

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: PathFinder placement portal"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/pathfinder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1B. Update .gitignore

Make sure your `.gitignore` includes:

```
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Build
.next/
out/
build/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
.pgsql

# Logs
logs/
*.log
```

### 1C. Check Repository Status

```bash
git status
git log --oneline (last 5 commits)
```

---

## ✅ STEP 2: CREATE VERCEL ACCOUNT & CONNECT GITHUB

### 2A. Create Vercel Account

1. Visit: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. Verify email

### 2B. Connect Your Repository

**Option A: During Account Creation**
1. After signup, click "Import Project"
2. Search for your "pathfinder" repository
3. Select the repository
4. Proceed to environment variables

**Option B: From Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Search for "pathfinder"
4. Click "Import"
5. Proceed to configuration

### 2C. Verify Git Connection

Your GitHub account should show:
- Repository connected ✅
- Auto-deploy on git push enabled ✅
- Production branch: `main`

---

## ✅ STEP 3: SET UP ENVIRONMENT VARIABLES

### 3A. Vercel Environment Configuration

In the Vercel project settings, navigate to:
Settings → Environment Variables

Add the following variables:

#### **Production** (`NEXT_PUBLIC_` = visible to browser)

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY = your-gemini-api-key
DATABASE_URL = postgresql://user:password@db-host:5432/placement_portal
NEXTAUTH_SECRET = generate-a-random-secret
NEXTAUTH_URL = https://your-domain.vercel.app
```

#### **Preview** (optional - for staging)
Same as Production (or use different keys for staging)

#### **Development** (for local development only)
Not needed in Vercel

### 3B. Format for Vercel Dashboard

Each variable should be added **individually**:

1. Click "+ Add New"
2. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://your-project.supabase.co`
4. **Select Environments**: 
   - ☑️ Production
   - ☑️ Preview
   - ☐ Development
5. Click "Save"

Repeat for each variable above.

### 3C: Generate NEXTAUTH_SECRET

```bash
# Run in your terminal
openssl rand -base64 32

# Output example:
# z7pK9mL2nQ4rT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4m=

# Use this value as NEXTAUTH_SECRET in Vercel
```

---

## ✅ STEP 4: CONFIGURE SUPABASE CREDENTIALS

### 4A. Get Supabase Keys

1. Go to: https://app.supabase.com
2. Select your project
3. Navigate to: **Settings → API**
4. Copy:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Key (anon public)**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Key (service_role)**: `SUPABASE_SERVICE_ROLE_KEY`

### 4B. Database Connection String

For `DATABASE_URL`:

**Option 1: Supabase PostgreSQL**
```
postgresql://postgres:password@db.supabase.co:5432/postgres
```

**Option 2: External Database (Neon, Railway, etc.)**
```
postgresql://user:password@host:5432/database_name
```

Get it from your database provider's dashboard.

### 4C. Enable Row-Level Security (RLS)

In Supabase:
1. Go to: Auth → Policies
2. Ensure RLS is enabled on all tables
3. Verify policies allow:
   - Students to see own data only
   - Companies to see own jobs & applications
   - Admins to see all data

---

## ✅ STEP 5: CONFIGURE GOOGLE GEMINI API

### 5A. Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key" → "Create API key in new project"
3. Copy the API key
4. Add to Vercel as: `NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY`

### 5B. Enable in Supabase (Optional)

1. Go to: Supabase Dashboard → Settings → API
2. Add Gemini endpoint for AI features
3. Or keep it in frontend (already configured)

### 5C: Test Gemini Integration

After deployment, test with:
```bash
curl -X POST https://your-domain.vercel.app/api/ai/mock-interview \
  -H "Content-Type: application/json" \
  -d '{ "action": "generate-questions", "jobDescription": "Software Engineer" }'
```

---

## ✅ STEP 6: DEPLOY TO VERCEL

### 6A. Automatic Deployment (Recommended)

**Your setup is already configured for auto-deployment!**

When you push to GitHub:
```bash
git add .
git commit -m "New feature: X"
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds the project
3. Runs tests
4. Deploys to production
5. Sends deployment notification

**Status**: Check https://vercel.com/dashboard

### 6B. Manual Deployment (If Needed)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel
```

### 6C: Build Configuration

Vercel auto-detects Next.js. Verify:

**Project Settings → Build & Development**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install` (or `pnpm install`)

All should be auto-detected ✅

---

## ✅ STEP 7: TEST PRODUCTION DEPLOYMENT

### 7A. Check Deployment Status

1. Go to: https://vercel.com/dashboard
2. Click on "pathfinder" project
3. View deployment logs in "Deployments" tab
4. Look for:
   - ✅ Build: Success
   - ✅ Function: Ready
   - ✅ Ready: Yes

### 7B. Test Key Features

**On your production URL** (https://pathfinder-xxxx.vercel.app):

```
Test Checklist:

[ ] Landing page loads (/)
[ ] Signup works (/auth/signup)
[ ] Login works (/auth/signin)
[ ] Student dashboard loads (/student/dashboard)
[ ] Job listings work (/student/jobs)
[ ] Company dashboard loads (/company/dashboard)
[ ] Mock interview generates questions (AI)
[ ] Flashcards generate correctly
[ ] Database queries work (applications load)
[ ] Notifications display
[ ] Analytics charts render
```

### 7C. Monitor for Errors

In Vercel Dashboard:

1. **Edges**: View function executions
2. **Logs**: Check for runtime errors
3. **Monitoring**: View performance metrics
4. **Errors**: Alert on failures

---

## ✅ STEP 8: CONFIGURE CUSTOM DOMAIN (OPTIONAL)

### 8A. Add Domain to Vercel

1. Go to: Project Settings → Domains
2. Click "Add"
3. Enter your domain: `pathfinder.com`
4. Choose DNS provider:
   - **Vercel DNS** (easiest)
   - **External DNS** (GoDaddy, Namecheap, etc.)

### 8B. Vercel DNS Method

1. Copy Vercel nameservers
2. Update domain registrar's nameservers
3. Vercel auto-provisions SSL/TLS ✅
4. Wait 24-48 hours for propagation

### 8C: External DNS Method

1. Add Vercel's DNS records to your provider
2. Typically: `CNAME` or `A` record
3. Vercel provides exact values to add
4. Wait for DNS propagation

### 8D. Verify Domain

```bash
# Test domain
curl -I https://pathfinder.com

# Should return 307 redirect to production
```

---

## ✅ STEP 9: SET UP MONITORING & ANALYTICS

### 9A. Enable Vercel Analytics

1. Project Settings → Analytics
2. Toggle "Enable Web Analytics"
3. This tracks:
   - Page views
   - Load times
   - Core Web Vitals
   - User experience metrics

### 9B. Configure Performance Alerts

1. Settings → Alerts
2. Click "+ Create New Alert"
3. Set conditions:
   - Build duration > 5 minutes
   - Response time > 2 seconds
   - Error rate > 1%
4. Choose notification: Email, Slack, etc.

### 9C: Integration with Tools (Optional)

**Sentry** (error tracking):
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize in next.config.mjs
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});
```

**Datadog** (monitoring):
- Create account at https://www.datadoghq.com
- Add API key to Vercel environment variables
- Monitor logs, metrics, performance

---

## ✅ STEP 10: CREATE CI/CD PIPELINE

### 10A. GitHub Actions (Already Works with Vercel)

Vercel auto-creates GitHub checks:
- Pre-deployment builds
- Preview deployments
- Automatic production deploys

View in: Repository → Actions

### 10B: Add Custom workflows (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 10C: Get Vercel Tokens

1. Go to: https://vercel.com/account/tokens
2. Create new token
3. Add to GitHub Secrets:
   - Settings → Secrets → `VERCEL_TOKEN`
   - Settings → Secrets → `VERCEL_ORG_ID`
   - Settings → Secrets → `VERCEL_PROJECT_ID`

---

## 🚀 DEPLOYMENT SUMMARY

### Pre-Deployment Checklist

- [ ] Code pushed to GitHub main branch
- [ ] All environment variables set in Vercel
- [ ] Supabase project created & credentials added
- [ ] Google Gemini API key configured
- [ ] Database schema migrated
- [ ] .env.local cleared (never commit secrets)
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (if configured)

### Deployment Configuration

```
Vercel Project Settings:
├─ Framework: Next.js ✅
├─ Build Command: npm run build ✅
├─ Output Directory: .next ✅
├─ Install Command: npm install ✅
├─ Node Version: 18.x ✅
├─ Environment Variables: 10+ configured ✅
├─ Git Connection: GitHub main ✅
├─ Auto-deploy: Enabled ✅
└─ HTTPS/SSL: Auto ✅
```

### Production URL

After deployment:
- **Main URL**: `https://pathfinder-xxxx.vercel.app`
- **Custom Domain**: `https://pathfinder.com` (optional)
- **Preview URLs**: Auto-generated for PRs

---

## 📊 POST-DEPLOYMENT

### Monitoring Dashboard

**After deployment, monitor:**

1. **Vercel Dashboard**
   - https://vercel.com/dashboard
   - Check build status
   - View deployment history
   - Monitor performance

2. **Email Notifications**
   - Deployment success/failure alerts
   - Performance warnings
   - Error notifications

3. **Database Status**
   - https://app.supabase.com
   - Check query logs
   - Monitor connections
   - View real-time stats

### Performance Metrics

Track these in production:

```
Metrics to Monitor:
├─ Page Load Time: < 2 seconds ✅
├─ First Contentful Paint (FCP): < 1.8s
├─ Largest Contentful Paint (LCP): < 2.5s
├─ Time to Interactive (TTI): < 3.8s
├─ Cumulative Layout Shift (CLS): < 0.1
├─ Error Rate: < 1%
└─ API Response Time: 100-500ms
```

---

## 🔧 TROUBLESHOOTING

### Issue 1: Build Fails with "Module not found"

**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear cache
npm cache clean --force

# Rebuild
npm run build

# Push to GitHub
git push origin main
```

### Issue 2: Environment Variables Not Loaded

**Check:**
1. Vercel Dashboard → Settings → Environment Variables
2. Restart deployment: "Redeploy" button
3. Wait for new build (2-5 minutes)
4. Check function logs for warnings

### Issue 3: Database Connection Failed

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Test connection locally first:
   ```bash
   psql $DATABASE_URL
   ```
4. Add IP address to Supabase firewall (if needed)

### Issue 4: API Endpoints Return 500

**Debug:**
1. Check Vercel Function logs
2. View Supabase logs
3. Check environment variables are set
4. Test with Postman/cURL locally first

### Issue 5: Slow Performance

**Optimize:**
1. Enable Image Optimization
   ```javascript
   // next.config.mjs
   images: {
     unoptimized: false, // Enable optimization
   }
   ```
2. Use Vercel Analytics to find bottlenecks
3. Optimize database queries
4. Enable caching headers

---

## 📚 HELPFUL RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment/vercel
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Actions**: https://github.com/features/actions
- **Vercel CLI**: https://vercel.com/docs/cli

---

## ✨ NEXT STEPS AFTER DEPLOYMENT

1. **Share the link**: Send production URL to stakeholders
2. **Test all features**: Do a full feature walkthrough
3. **Monitor performance**: Set up alerts & dashboards
4. **Gather feedback**: From students, companies, admins
5. **Plan updates**: Create roadmap for improvements
6. **Scale incrementally**: Add features based on usage
7. **Schedule reviews**: Weekly performance reviews

---

## 🎯 DEPLOYMENT TIMELINE

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Push to GitHub | 5 min | ⏳ |
| 2 | Create Vercel account | 5 min | ⏳ |
| 3 | Connect GitHub repo | 5 min | ⏳ |
| 4 | Set env variables | 10 min | ⏳ |
| 5 | Configure Supabase | 10 min | ⏳ |
| 6 | Configure Gemini API | 5 min | ⏳ |
| 7 | Deploy to Vercel | 5 min | ⏳ |
| 8 | Test production | 15 min | ⏳ |
| 9 | Set up monitoring | 10 min | ⏳ |
| 10 | Configure custom domain | 10 min | ⏳ (optional) |
| **TOTAL** | **Complete deployment** | **~75 minutes** | ✅ |

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

✅ Vercel deployment shows "Ready"
✅ Landing page loads at production URL
✅ Authentication (signup/login) works
✅ Database queries return data
✅ AI features (mock interview) generate responses
✅ No console errors in browser
✅ No server errors in Vercel logs
✅ Performance metrics are within targets
✅ Users can apply for jobs & track applications
✅ Admin analytics dashboard loads

---

**Deployment Complete!** 🎊

Your PathFinder placement portal is now live on Vercel and ready for users!

---

**Created**: February 11, 2026
**Status**: Deployment Ready
**Next Review**: 1 week after deployment


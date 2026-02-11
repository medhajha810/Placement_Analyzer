# Vercel Deployment Quick Checklist

## ✅ Pre-Deployment (Local Setup)

- [ ] All code committed to GitHub (`git log` to verify)
- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] `npm run build` passes locally without errors
- [ ] `npm run dev` works perfectly
- [ ] Database migrations are complete
- [ ] No console warnings or errors

## ✅ GitHub Repository Ready

```bash
# Verify everything is pushed
git status  # Should show "nothing to commit"
git push origin main

# Check remote
git remote -v
# Output should show GitHub URL
```

## ✅ Vercel Account Setup (5 minutes)

- [ ] Visit https://vercel.com and sign up
- [ ] Connect your GitHub account
- [ ] Grant Vercel access to your repositories
- [ ] Email verified

## ✅ Create Vercel Project (5 minutes)

1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "New Project"
3. [ ] Search for and select "pathfinder" repository
4. [ ] Click "Import"
5. [ ] Wait for project creation

## ✅ Configure Environment Variables (10 minutes)

In Vercel Dashboard → Project Settings → Environment Variables:

### Required Variables (Production)

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environments: Production, Preview
```

```
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [your-anon-key]
Environments: Production, Preview
```

```
Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: [your-service-role-key]
Environments: Production, Preview
```

```
Variable Name: NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY
Value: [your-gemini-api-key]
Environments: Production, Preview
```

```
Variable Name: DATABASE_URL
Value: postgresql://user:password@host:5432/db
Environments: Production, Preview
```

```
Variable Name: NEXTAUTH_SECRET
Value: [generate with: openssl rand -base64 32]
Environments: Production, Preview
```

```
Variable Name: NEXTAUTH_URL
Value: https://pathfinder-xxxx.vercel.app
Environments: Production, Preview
```

**Total Variables to Add: 7**

## ✅ Get Required Credentials (15 minutes)

### Supabase Keys
- [ ] Go to https://app.supabase.com → Select project
- [ ] Settings → API → Copy:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Google Gemini API Key
- [ ] Visit https://makersuite.google.com/app/apikey
- [ ] Click "Create API Key"
- [ ] Copy key
- [ ] Add as `NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY`

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
# Copy output and paste in Vercel
```

### Database URL
- [ ] Get from database provider (Supabase/Neon/Railway)
- [ ] Format: `postgresql://user:password@host:5432/database`

## ✅ Deploy (5 minutes)

- [ ] All environment variables are set ✓
- [ ] Click "Deploy" button in Vercel
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for errors
- [ ] Verify deployment status is "Ready"

## ✅ Post-Deployment Tests (15 minutes)

Test on production URL: `https://pathfinder-xxxx.vercel.app`

### Core Features
- [ ] Landing page loads (`/`)
- [ ] Signup page works (`/auth/signup`)
- [ ] Login page works (`/auth/signin`)
- [ ] Can create account (test with throw-away email)
- [ ] Can login with new account

### Student Features
- [ ] Student dashboard loads (`/student/dashboard`)
- [ ] Job listings page works (`/student/jobs`)
- [ ] Can search/filter jobs
- [ ] Can view job details
- [ ] Applications appear after applying

### Database Connectivity
- [ ] Data loads from database
- [ ] Can see user profile information
- [ ] Can view job postings

### AI Features (if configured)
- [ ] Mock interview page loads
- [ ] Can generate interview questions
- [ ] Flashcard generation works

### API Health
- [ ] Check function logs in Vercel
- [ ] No 500 errors in responses
- [ ] API responses under 1 second

## ✅ Performance Check (5 minutes)

In Vercel Dashboard → Deployments:

- [ ] Build time: < 5 minutes
- [ ] Function cold start: < 50ms
- [ ] API response time: 100-500ms

## ✅ Error Monitoring Setup (5 minutes)

- [ ] Enable Vercel Analytics (Settings → Analytics)
- [ ] Set up error alerts (Settings → Alerts)
- [ ] Add email notifications
- [ ] Test alert by causing intentional error

## ✅ Optional: Custom Domain Setup (10 minutes)

- [ ] Go to Project Settings → Domains
- [ ] Add your custom domain (e.g., pathfinder.com)
- [ ] Choose DNS provider (Vercel DNS recommended)
- [ ] Update nameservers at registrar
- [ ] Wait 24-48 hours for propagation
- [ ] Verify SSL certificate is auto-generated

## ✅ Final Verification

- [ ] Production URL is accessible
- [ ] All major features work
- [ ] No critical errors in logs
- [ ] Performance is acceptable
- [ ] Users can sign up & login
- [ ] Data persists in database

## 🎉 Deployment Complete!

### Share the good news
- [ ] Share production URL with team
- [ ] Update documentation with new URL
- [ ] Setup production monitoring
- [ ] Plan next features

---

## 🚀 Deployment Timeline

| Activity | Time | Completed |
|----------|------|-----------|
| GitHub setup | 5 min | ⏳ |
| Vercel account | 5 min | ⏳ |
| Project import | 5 min | ⏳ |
| Get credentials | 15 min | ⏳ |
| Add env variables | 10 min | ⏳ |
| Deploy | 5 min | ⏳ |
| Test features | 15 min | ⏳ |
| Final check | 5 min | ⏳ |
| **TOTAL** | **~65 minutes** | |

---

## ⚠️ Common Mistakes to Avoid

❌ Don't commit `.env.local` to GitHub
❌ Don't use same keys for multiple projects
❌ Don't skip environment variable setup
❌ Don't deploy without testing locally first
❌ Don't ignore build error logs
✅ Do backup your API keys
✅ Do test in staging first
✅ Do monitor after deployment
✅ Do update documentation

---

## 📞 Need Help?

**Typical Issues:**

1. **"Module not found"** → Run `npm install` locally, rebuild
2. **"ENV variables missing"** → Add to Vercel dashboard, redeploy
3. **"Database connection failed"** → Verify DATABASE_URL, check firewall
4. **"Build timeout"** → Optimize code, check for infinite loops
5. **"API error 500"** → Check Vercel function logs

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Search for your error
- Vercel Support: https://vercel.com/support

---

Print this checklist and go through it step-by-step! ✨


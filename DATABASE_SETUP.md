# Database Migration Guide

## ⚠️ IMPORTANT: Clean Slate Required

If you've run any previous SQL scripts, you MUST clean up first to avoid conflicts.

### Step 0: Clean Up Existing Tables (If Any)
```bash
psql -U your_username -d your_database -f scripts/99-cleanup-all-tables.sql
```
**OR in Supabase SQL Editor:**
```sql
-- Copy and run the contents of scripts/99-cleanup-all-tables.sql
```

This removes ALL tables and lets you start fresh. Skip this if it's a brand new database.

---

## Migration Order (IMPORTANT!)

Run the SQL scripts in this exact order:

### 1. Base Schema (REQUIRED FIRST)
```bash
psql -U your_username -d your_database -f scripts/00-create-base-schema.sql
```
**What it creates:**
- Core tables: students, companies, jobs, applications, mock_tests, flash_cards
- Foundation for all other features
- Sample seed data for testing

### 2. Shadow Profiles & Advanced Features (Optional)
```bash
psql -U your_username -d your_database -f scripts/01-create-shadow-profiles.sql
```
**What it creates:**
- users (authentication)
- student_profiles_extended
- placement_drives
- application_details
- scraped_jobs
- mock_interviews
- placement_readiness_metrics
- dream_company_roadmap
- company_flashcards
- referrals
- admin_forecasts
- Enhanced tracking tables

### 3. Interview Intelligence Suite
```bash
psql -U your_username -d your_database -f scripts/02-create-senior-secrets.sql
```
**What it creates:**
- interview_experiences
- interview_rounds
- experience_votes
- experience_tags
- Senior's Secret Database

### 4. Gamification & Community (Requires Base Schema)
```bash
psql -U your_username -d your_database -f scripts/03-create-gamification.sql
```
**What it creates:**
- dream_companies
- company_skill_requirements
- dream_company_progress
- referral_board
- referral_applications
- prs_history
- student_achievements
- Engagement views and functions

## Using Supabase

If you're using Supabase, run each script through the SQL Editor:

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Copy the contents of `00-create-base-schema.sql`
3. Paste and click "Run"
4. Wait for success confirmation
5. Repeat for scripts 01, 02, 03 in order

## Verifying Installation

After running all scripts, verify tables were created:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should see:
-- applications
-- companies
-- company_skill_requirements
-- dream_companies
-- dream_company_progress
-- experience_tags
-- experience_votes
-- flash_cards
-- historical_placements (if script 01 run)
-- interview_experiences
-- interview_rounds
-- jobs
-- mock_tests
-- performance_predictions (if script 01 run)
-- prs_history
-- referral_applications
-- referral_board
-- skill_assessments (if script 01 run)
-- student_achievements
-- students
```

## Common Errors

### Error: "relation 'students' does not exist"
**Solution:** You skipped step 1. Run `00-create-base-schema.sql` first.

### Error: "column 'company_name' does not exist"
**Solution:** Check that base tables were created. Verify with:
```sql
\d students
\d companies
```

### Error: "duplicate key value violates unique constraint"
**Solution:** You're running the script twice. Either:
- Drop all tables and start fresh, OR
- Remove seed data sections from scripts

## Dropping All Tables (CAUTION!)

If you need to start fresh:

```sql
-- Drop all tables (THIS DELETES EVERYTHING!)
DROP TABLE IF EXISTS referral_applications CASCADE;
DROP TABLE IF EXISTS referral_board CASCADE;
DROP TABLE IF EXISTS dream_company_progress CASCADE;
DROP TABLE IF EXISTS dream_companies CASCADE;
DROP TABLE IF EXISTS company_skill_requirements CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS prs_history CASCADE;
DROP TABLE IF EXISTS experience_tags CASCADE;
DROP TABLE IF EXISTS experience_votes CASCADE;
DROP TABLE IF EXISTS interview_rounds CASCADE;
DROP TABLE IF EXISTS interview_experiences CASCADE;
DROP TABLE IF EXISTS flash_cards CASCADE;
DROP TABLE IF EXISTS mock_tests CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Then re-run scripts in order
```

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Next Steps

After database setup:
1. Test API endpoints in `app/api/`
2. Update Supabase connection strings
3. Remove mock data from components
4. Test each feature flow
5. Set up Row Level Security (RLS) policies

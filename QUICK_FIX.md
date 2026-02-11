# Quick Fix: "column job_id does not exist" Error

## Problem
You have conflicting table definitions from running different SQL scripts. The old `applications` table uses `drive_id`, but the new schema expects `job_id`.

## Solution: Start Fresh

### For Supabase Users:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

2. **Drop All Tables**
   - Copy the entire contents of `scripts/99-cleanup-all-tables.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Wait for confirmation

3. **Run Base Schema**
   - Copy the entire contents of `scripts/00-create-base-schema.sql`
   - Paste into SQL Editor
   - Click "Run"
   - You should see: "Success. No rows returned"

4. **Run Senior's Secret Database**
   - Copy the entire contents of `scripts/02-create-senior-secrets.sql`
   - Paste into SQL Editor
   - Click "Run"

5. **Run Gamification Schema**
   - Copy the entire contents of `scripts/03-create-gamification.sql`
   - Paste into SQL Editor
   - Click "Run"

6. **Verify Installation**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
   
   You should see these tables:
   - applications ✅
   - companies ✅
   - company_skill_requirements ✅
   - dream_companies ✅
   - dream_company_progress ✅
   - experience_tags ✅
   - experience_votes ✅
   - flash_cards ✅
   - interview_experiences ✅
   - interview_rounds ✅
   - jobs ✅
   - mock_tests ✅
   - prs_history ✅
   - referral_applications ✅
   - referral_board ✅
   - student_achievements ✅
   - students ✅

### For Local PostgreSQL Users:

```bash
# 1. Drop everything
psql -U your_username -d your_database -f scripts/99-cleanup-all-tables.sql

# 2. Create base schema
psql -U your_username -d your_database -f scripts/00-create-base-schema.sql

# 3. Create interview features
psql -U your_username -d your_database -f scripts/02-create-senior-secrets.sql

# 4. Create gamification features
psql -U your_username -d your_database -f scripts/03-create-gamification.sql

# 5. Verify
psql -U your_username -d your_database -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
```

## Why This Happened

You likely ran `scripts/01-create-schema.sql` (the old schema) which created:
- `applications` table with `drive_id` column
- `placement_drives` table

Then you tried to run `scripts/00-create-base-schema.sql` which expects:
- `applications` table with `job_id` column
- `jobs` table

Because both scripts use `CREATE TABLE IF NOT EXISTS`, the old tables weren't replaced, causing conflicts.

## DO NOT Use These Files:
- ❌ `scripts/01-create-schema.sql` (old, conflicting schema)

## USE These Files (In Order):
1. ✅ `scripts/99-cleanup-all-tables.sql` (cleanup)
2. ✅ `scripts/00-create-base-schema.sql` (base)
3. ✅ `scripts/02-create-senior-secrets.sql` (interview features)
4. ✅ `scripts/03-create-gamification.sql` (gamification)

## After Setup

Update your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Then restart your Next.js dev server:
```bash
npm run dev
```

All APIs should now work correctly! 🎉

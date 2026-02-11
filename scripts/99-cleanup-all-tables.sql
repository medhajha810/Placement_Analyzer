-- ============================================
-- CLEANUP SCRIPT - DROP ALL EXISTING TABLES
-- ============================================
-- WARNING: THIS WILL DELETE ALL DATA!
-- Run this ONLY if you want to start fresh

-- Drop tables in reverse dependency order to avoid foreign key errors

-- Drop gamification tables (if they exist)
DROP TABLE IF EXISTS referral_applications CASCADE;
DROP TABLE IF EXISTS referral_board CASCADE;
DROP TABLE IF EXISTS dream_company_progress CASCADE;
DROP TABLE IF EXISTS dream_companies CASCADE;
DROP TABLE IF EXISTS company_skill_requirements CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS prs_history CASCADE;

-- Drop senior's secret tables
DROP TABLE IF EXISTS experience_tags CASCADE;
DROP TABLE IF EXISTS experience_votes CASCADE;
DROP TABLE IF EXISTS interview_rounds CASCADE;
DROP TABLE IF EXISTS interview_experiences CASCADE;

-- Drop shadow profile / old schema tables
DROP TABLE IF EXISTS eligibility_cache CASCADE;
DROP TABLE IF EXISTS admin_forecasts CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS company_flashcards CASCADE;
DROP TABLE IF EXISTS dream_company_roadmap CASCADE;
DROP TABLE IF EXISTS placement_readiness_metrics CASCADE;
DROP TABLE IF EXISTS learning_progress CASCADE;
DROP TABLE IF EXISTS skill_gaps CASCADE;
DROP TABLE IF EXISTS mock_interviews CASCADE;
DROP TABLE IF EXISTS scraped_jobs CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS application_details CASCADE;
DROP TABLE IF EXISTS placement_drives CASCADE;
DROP TABLE IF EXISTS student_profiles_extended CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS student_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop base tables
DROP TABLE IF EXISTS flash_cards CASCADE;
DROP TABLE IF EXISTS mock_tests CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Verify all tables are dropped
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_name;

-- If you see any tables listed above, you may need to drop them manually
-- The CASCADE keyword should handle most dependencies

COMMENT ON SCHEMA public IS 'All tables have been dropped. Ready for fresh migration.';

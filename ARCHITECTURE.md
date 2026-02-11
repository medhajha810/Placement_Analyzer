# PathFinder - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PATHFINDER PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   LANDING PAGE       │         │   AUTHENTICATION     │     │
│  │  (Public, No Auth)   │         │  (Sign up / Sign In) │     │
│  └──────────────────────┘         └──────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          STUDENT PORTAL          │   COMPANY PORTAL     │   │
│  ├──────────────────────────────────┼──────────────────────┤   │
│  │ • Dashboard (Kanban)             │ • HR Dashboard       │   │
│  │ • Job Listings                   │ • Analytics          │   │
│  │ • Application Tracking           │ • Candidate Mgmt     │   │
│  │ • Skill Gap Analysis             │ • Job Posting        │   │
│  │ • Company Insights               │                      │   │
│  └──────────────────────────────────┴──────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   NEXT.JS 16     │
                    │   App Router     │
                    └──────────────────┘
                              ▼
        ┌─────────────────────┬─────────────────────┐
        ▼                     ▼                     ▼
    ┌────────────┐    ┌─────────────┐    ┌──────────────┐
    │  Frontend  │    │  API Layer  │    │  Database    │
    │  Components│    │  (REST)     │    │  (Supabase)  │
    └────────────┘    └─────────────┘    └──────────────┘
```

## Frontend Architecture

### Page Hierarchy

```
/                                    (Landing Page)
├── /auth/signup                     (Sign Up - Role Selection)
├── /auth/signin                     (Sign In)
├── /student/                        (Student Portal)
│   ├── /dashboard                   (Kanban + Stats)
│   └── /jobs                        (Job Listings)
└── /company/                        (Company Portal)
    └── /dashboard                   (HR Dashboard)
```

### Component Structure

```
app/
├── page.tsx                         Landing Page
├── layout.tsx                       Root Layout
├── globals.css                      Global Styles
│
├── auth/
│   ├── signup/page.tsx              Signup Page
│   └── signin/page.tsx              Signin Page
│
├── student/
│   ├── dashboard/page.tsx           Student Dashboard
│   └── jobs/page.tsx                Job Listings
│
└── company/
    └── dashboard/page.tsx           Company Dashboard

components/
├── auth-signup.tsx                  Signup Form Component
├── auth-signin.tsx                  Signin Form Component
├── student-dashboard.tsx            Kanban Board + Stats
├── company-dashboard.tsx            HR Analytics
├── job-listings.tsx                 Job Search & Browse
└── ui/                              50+ shadcn/ui components
```

## Backend Architecture

### API Routes

```
/api/
├── /auth/
│   ├── signup/route.ts             POST - Create account
│   └── signin/route.ts             POST - Authenticate
├── /jobs/
│   ├── route.ts                    GET/POST - List/Create jobs
│   └── /[id]/route.ts              GET/PATCH/DELETE - Job details
└── /applications/
    ├── route.ts                    GET/POST/PATCH - App management
    └── /[id]/route.ts              GET/PATCH - App details
```

### Request Flow Example (Signup)

```
┌─────────────────────┐
│  User Signup Form   │
│  (auth-signup.tsx)  │
└──────────┬──────────┘
           │ POST
           ▼
    ┌─────────────────────────┐
    │ /api/auth/signup        │
    │ (route.ts)              │
    └──────────┬──────────────┘
               │
               ▼
        ┌────────────────────────┐
        │ Supabase Auth.signUp() │
        │ • Hash password        │
        │ • Create user          │
        │ • Send verification    │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │ Return Auth Data       │
        │ • User ID              │
        │ • Session Token        │
        │ • Email                │
        └──────────┬─────────────┘
                   │
                   ▼
            ┌─────────────┐
            │ Redirect    │
            │ /dashboard  │
            └─────────────┘
```

## Database Schema

### Tables Overview

```
┌──────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL                   │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────┐      ┌─────────────────┐            │
│  │     users      │      │   students      │            │
│  ├────────────────┤      ├─────────────────┤            │
│  │ • id (PK)      │◄────►│ • id (FK)       │            │
│  │ • email        │      │ • skills        │            │
│  │ • role         │      │ • experience    │            │
│  │ • name         │      │ • resume        │            │
│  └────────────────┘      └─────────────────┘            │
│           ▲                                              │
│           │                                              │
│           │                                              │
│  ┌────────────────────────────────────────────┐          │
│  │         applications (Join Table)          │          │
│  ├────────────────────────────────────────────┤          │
│  │ • id (PK)                                  │          │
│  │ • student_id (FK) ──────────┐             │          │
│  │ • job_id (FK) ─────────────┐ │             │          │
│  │ • status                   │ │             │          │
│  │ • applied_date             │ │             │          │
│  └────────────────────────────┼─┼─────────────┘          │
│                               │ │                        │
│                    ┌──────────┘ │                        │
│                    │            │                        │
│         ┌──────────▼──┐   ┌─────▼──────────┐            │
│         │ job_postings│   │   companies    │            │
│         ├─────────────┤   ├────────────────┤            │
│         │ • id (PK)   │   │ • id (PK)      │            │
│         │ • title     │   │ • name         │            │
│         │ • location  │◄──│ • id (FK)      │            │
│         │ • salary    │   │ • industry     │            │
│         │ • company_id│   └────────────────┘            │
│         └─────────────┘                                  │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │       skill_gaps (AI Analysis)             │          │
│  ├────────────────────────────────────────────┤          │
│  │ • id                                       │          │
│  │ • student_id (FK) ──► students             │          │
│  │ • required_skill                           │          │
│  │ • gap_score                                │          │
│  │ • recommendation                           │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │    eligibility_checks (HR Criteria)        │          │
│  ├────────────────────────────────────────────┤          │
│  │ • id                                       │          │
│  │ • job_id (FK) ──► job_postings             │          │
│  │ • min_experience                           │          │
│  │ • required_skills[]                        │          │
│  │ • cgpa_threshold                           │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### Table Relationships

```
users (auth.users)
  └── students (1:1)
      └── applications (1:N)
          ├── job_postings (N:1)
          │   ├── companies (N:1)
          │   └── eligibility_checks (1:N)
          └── skill_gaps (1:N)

companies (1:1)
  └── job_postings (1:N)
```

## Data Flow Diagrams

### Student Job Application Flow

```
1. Browse Jobs
   ├── /api/jobs (GET)
   └── Display with AI match %

2. Apply for Job
   ├── POST /api/applications
   ├── Store in applications table
   └── Update user dashboard

3. Track Application
   ├── View in Kanban board
   ├── Update status (applied → hired)
   └── See in applications list
```

### Company Hiring Flow

```
1. Post Job
   ├── POST /api/jobs
   ├── Store job_posting
   └── Set eligibility criteria

2. Receive Applications
   ├── Students apply
   ├── AI matches candidates
   └── View in candidate pipeline

3. Manage Process
   ├── Screening → Interview → Offer → Hired
   ├── Update status
   └── View analytics
```

## Authentication Flow

```
┌─────────────────────┐
│  User Signup Form   │
└──────────┬──────────┘
           │
           ▼
    ┌────────────────────────────┐
    │ /api/auth/signup           │
    │ • Validate input           │
    │ • Create Supabase user     │
    │ • Store role in metadata   │
    └──────────┬─────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │ Supabase Auth              │
    │ • Hash password (bcrypt)   │
    │ • Generate session token   │
    │ • Send confirmation email  │
    └──────────┬─────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │ Return to Client           │
    │ • user ID                  │
    │ • session token            │
    │ • email                    │
    └──────────┬─────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │ Store Session              │
    │ • Browser storage          │
    │ • HTTP-only cookies        │
    └──────────┬─────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │ Redirect to Dashboard      │
    │ • Student or Company       │
    └────────────────────────────┘
```

## Technology Stack

```
Frontend Layer:
├── Next.js 16 (App Router)
├── React 19.2
├── TypeScript
└── Tailwind CSS v3

UI Components:
├── shadcn/ui (50+ components)
├── Radix UI primitives
├── Lucide React (icons)
└── Recharts (data visualization)

Backend/Database:
├── Supabase (PostgreSQL)
├── Supabase Auth
└── RESTful API

Deployment:
└── Vercel (recommended)
```

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│           SECURITY LAYERS                       │
├─────────────────────────────────────────────────┤
│                                                  │
│ 1. Authentication                               │
│    └── Supabase Auth (industry-standard)       │
│                                                  │
│ 2. Authorization                                │
│    └── Role-based access (student/company)     │
│                                                  │
│ 3. Row-Level Security (RLS)                    │
│    └── Database policies per user              │
│                                                  │
│ 4. Data Encryption                              │
│    └── HTTPS + Supabase SSL                    │
│                                                  │
│ 5. API Security                                 │
│    └── Input validation + CORS                 │
│                                                  │
│ 6. Password Security                            │
│    └── bcrypt hashing via Supabase             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Scaling Considerations

```
Current Architecture:
├── Single Supabase instance
├── Serverless functions on Vercel
├── CDN for static assets
└── Real-time updates via subscriptions

Scaling to 10K Users:
├── Database connection pooling
├── Caching layer (Redis)
├── API rate limiting
├── Email queue system

Scaling to 100K Users:
├── Database read replicas
├── Search index (Elasticsearch)
├── File storage optimization
└── Analytics warehouse
```

---

**This architecture is production-ready and can scale from hundreds to millions of users.**

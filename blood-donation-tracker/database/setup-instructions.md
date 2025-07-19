# LifeFlow Database Setup Instructions

## Prerequisites
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update your `.env` files with the credentials

## Step 1: Set up Environment Variables

### For Main App (`blood-donation-tracker/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### For Admin App (`lifeflow-admin/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 2: Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `schema.sql`
4. Click **Run** to execute the schema

## Step 3: Test with Sample Data (Optional)

1. In the SQL Editor, copy and paste the contents of `sample-data.sql`
2. **Important**: First create some test users in Supabase Auth, then update the UUIDs in the sample data
3. Click **Run** to insert sample data

## Step 4: Verify Setup

Run these queries in the SQL Editor to verify everything is working:

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check blood types enum
SELECT unnest(enum_range(NULL::blood_type_enum)) as blood_types;

-- Check sample data (if inserted)
SELECT COUNT(*) as hospital_count FROM public.hospitals;
SELECT COUNT(*) as donor_count FROM public.donors;
SELECT COUNT(*) as request_count FROM public.blood_requests;
```

## Step 5: Row Level Security (RLS) Verification

The schema includes RLS policies. Test them by:

1. Creating a test user in Supabase Auth
2. Using the user's JWT token to test data access
3. Ensuring users can only access their own data

## Next Steps

After database setup:
1. Test database connections in both applications
2. Create database helper functions
3. Implement CRUD operations for each table
4. Set up real-time subscriptions for live updates

## Troubleshooting

### Common Issues:
- **Permission denied**: Check RLS policies
- **Function not found**: Ensure all extensions are enabled
- **UUID errors**: Make sure to use actual user IDs from auth.users table

### Useful Queries:
```sql
-- View all users
SELECT id, email, created_at FROM auth.users;

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- View table permissions
SELECT * FROM information_schema.table_privileges 
WHERE table_schema = 'public';
```

# Supabase Setup Guide

This guide will help you set up Supabase for authentication and data syncing in your fitness app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `fitness-app` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Configure Environment Variables

Create a `.env` file in your project root with:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials.

## 4. Set Up Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user_data table
CREATE TABLE user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_backups table
CREATE TABLE user_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  backup_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;

-- Create policies for user_data
CREATE POLICY "Users can only access their own data" ON user_data
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for user_backups
CREATE POLICY "Users can only access their own backups" ON user_backups
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_updated_at ON user_data(updated_at);
CREATE INDEX idx_user_backups_user_id ON user_backups(user_id);
CREATE INDEX idx_user_backups_created_at ON user_backups(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_data
CREATE TRIGGER update_user_data_updated_at 
    BEFORE UPDATE ON user_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 5. Configure Authentication Providers (Optional)

### Google OAuth
1. Go to Authentication → Providers in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

### GitHub OAuth
1. Go to Authentication → Providers in Supabase
2. Enable GitHub provider
3. Add your GitHub OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

## 6. Configure Email Templates (Optional)

1. Go to Authentication → Email Templates
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 7. Test the Setup

1. Start your development server: `npm start`
2. Try to register a new account
3. Check if the user appears in Authentication → Users
4. Try logging in and out
5. Test data syncing by creating some workout data

## 8. Production Deployment

### For GitHub Pages:
1. Add your production domain to Authentication → URL Configuration
2. Update Site URL to your GitHub Pages URL
3. Add redirect URLs for your production domain

### Environment Variables for Production:
Make sure to set the environment variables in your deployment platform:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## Features Included

✅ **Email/Password Authentication**
- User registration with email verification
- Secure login/logout
- Password reset functionality

✅ **Social Authentication**
- Google OAuth
- GitHub OAuth

✅ **Data Synchronization**
- Automatic cloud sync on login/logout
- Manual sync options in user profile
- Conflict resolution (latest-wins strategy)

✅ **Data Security**
- Row Level Security (RLS)
- User data isolation
- Secure API calls

✅ **Backup System**
- Create manual backups
- Restore from backups
- Backup history

✅ **Real-time Features**
- Live data synchronization
- Real-time updates across devices

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure `.env` file is in project root
   - Restart development server after adding env vars

2. **Authentication not working**
   - Check Supabase project URL and key
   - Verify email confirmation settings
   - Check browser console for errors

3. **Data not syncing**
   - Check user authentication status
   - Verify database policies are set up correctly
   - Check network connectivity

4. **Social login not working**
   - Verify OAuth provider configuration
   - Check redirect URLs
   - Ensure providers are enabled in Supabase

### Getting Help:

- Check the browser console for error messages
- Review Supabase logs in the dashboard
- Consult the [Supabase documentation](https://supabase.com/docs)
- Check the [Supabase community](https://github.com/supabase/supabase/discussions)

## Security Best Practices

1. **Never commit your `.env` file** - Add it to `.gitignore`
2. **Use Row Level Security** - Already configured in the setup
3. **Validate data on the client** - Input validation is included
4. **Regular backups** - Use the backup system regularly
5. **Monitor usage** - Check Supabase dashboard for unusual activity

## Next Steps

After setup, you can:
1. Customize the authentication UI
2. Add more social providers
3. Implement real-time features
4. Add more advanced data syncing
5. Set up monitoring and analytics 
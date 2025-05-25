# Environment Setup Guide

## 🔧 Fixing the "Cannot read properties of null (reading 'auth')" Error

This error occurs because Supabase environment variables are not configured. The app will now run in offline mode, but to enable full authentication features, follow these steps:

## Quick Fix (Development)

1. **Create a `.env` file** in your project root (same level as `package.json`)

2. **Add these lines** to the `.env` file:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

3. **Replace with your actual Supabase credentials** (see "Getting Supabase Credentials" below)

4. **Restart your development server**:
```bash
npm start
```

## Getting Supabase Credentials

### Option 1: Use Existing Supabase Project
If you already have a Supabase project:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon/public key"

### Option 2: Create New Supabase Project
If you don't have a Supabase project:

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details and create
4. Go to Settings → API
5. Copy the credentials

### Option 3: Run in Offline Mode
If you want to run without Supabase temporarily:

```env
REACT_APP_DISABLE_SUPABASE=true
```

## Environment File Examples

### Development (.env)
```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Offline Mode (.env)
```env
REACT_APP_DISABLE_SUPABASE=true
```

## Security Notes

- ✅ **Never commit** `.env` files with real credentials to version control
- ✅ **Add** `.env` to your `.gitignore` file
- ✅ **Use** `.env.local` for local development with real credentials
- ✅ **Use** environment variables in production deployment

## Verification

After setup, you should see in the console:
- ✅ No more "Cannot read properties of null" errors
- ✅ Either "Supabase initialized successfully" or "Running in offline mode"
- ✅ App loads without authentication errors

## Need Help?

Check the detailed setup guide in `SUPABASE_SETUP.md` for database table creation and advanced configuration. 
# 🧪 FitTrack Demo Mode Guide

## What is Demo Mode?

Demo Mode allows you to test and explore the FitTrack fitness app without needing to configure Supabase authentication or create an account. It's perfect for:

- 🔍 **Exploring Features**: Test all app functionality without registration
- 🛠️ **Development**: Work on the app without backend dependencies  
- 📱 **Demonstrations**: Show the app to others quickly
- 🧪 **Testing**: Try new features in a safe environment

## Quick Start - Enable Demo Mode

### Method 1: Using Scripts (Recommended)

**For Windows:**
```bash
# Double-click or run in terminal
./enable-demo-mode.bat
```

**For Linux/Mac:**
```bash
# Run in terminal
./enable-demo-mode.sh
```

### Method 2: Manual Setup

Create a `.env` file in your project root with:
```env
# Demo/Test Mode Configuration
REACT_APP_DISABLE_SUPABASE=true
REACT_APP_DEMO_MODE=true
```

## How to Login in Demo Mode

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Visit:** `http://localhost:3000/fitness`

3. **Login Options:**
   
   ### 🚀 Quick Demo Login (Recommended)
   - Click the **"🚀 Demo starten"** button
   - Instantly access the app as a demo user
   
   ### 📧 Traditional Form Login
   - Enter any email and password
   - Both signup and signin work the same in demo mode
   
   ### 🔗 Social Login Simulation
   - Click "Demo Google" or "Demo GitHub" 
   - Simulates social login with demo user

## Demo User Details

When logged in via demo mode, you'll be signed in as:
- **Email:** `demo@fittrack.app`
- **Name:** `Demo User`
- **User ID:** `demo-user-12345`

## Features in Demo Mode

✅ **Full Functionality Available:**
- Create and manage workout plans
- Track exercises and progress
- Use nutrition features
- Access gamification systems
- View analytics and reports
- Backup and restore data

✅ **Data Persistence:**
- All data is stored locally in your browser
- Data persists between sessions
- No data is sent to external servers

✅ **Offline Operation:**
- Works completely offline
- No internet connection required
- No backend dependencies

## Visual Indicators

When demo mode is active, you'll see:
- 🧪 **Orange banner** indicating demo mode
- **Modified login interface** with demo options
- **Console logs** showing demo mode status

## Switching Back to Full Mode

To disable demo mode and use real Supabase authentication:

1. **Delete the `.env` file** or remove demo mode lines
2. **Configure Supabase** in `.env.production` or `.env`
3. **Restart the application**

## Development Benefits

### For Developers:
- No need to set up Supabase during development
- Test authentication flows without external dependencies
- Simulate user interactions safely
- Quick prototyping and feature testing

### For Testers:
- Immediate access to test all features
- No account creation friction
- Consistent test user experience
- Easy reset by clearing browser data

## Troubleshooting

### Demo Mode Not Working?

1. **Check Environment Variables:**
   ```bash
   # Verify .env file contains:
   REACT_APP_DISABLE_SUPABASE=true
   ```

2. **Restart the Development Server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm start
   ```

3. **Clear Browser Cache:**
   - Clear localStorage and sessionStorage
   - Hard refresh the page (Ctrl+Shift+R)

### Can't See Demo Login Button?

- Check browser console for errors
- Ensure you're visiting `http://localhost:3000/fitness` (not just `/`)
- Verify the `.env` file is in the project root

### Data Not Persisting?

- Demo mode uses browser localStorage
- Data will persist until you clear browser data
- Private/incognito mode may not persist data

## Security Note

⚠️ **Demo mode is for development/testing only!**
- Do not use in production environments
- No real authentication is performed
- All data is stored locally and unencrypted

## Advanced Configuration

You can customize demo mode by modifying the `DEMO_USER` object in `src/context/AuthContext.js`:

```javascript
const DEMO_USER = {
  id: 'demo-user-12345',
  email: 'demo@fittrack.app',
  user_metadata: {
    name: 'Your Custom Demo User',
    avatar_url: null
  },
  // ... other properties
};
```

## Support

If you encounter issues with demo mode:
1. Check this guide first
2. Look for error messages in browser console
3. Verify your environment configuration
4. Try clearing browser data and restarting

---

**Happy testing! 🚀** 
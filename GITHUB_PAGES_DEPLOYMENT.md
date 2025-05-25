# GitHub Pages Deployment Guide

This guide will help you deploy your fitness app with authentication and data syncing to GitHub Pages.

## 🚀 Pre-Deployment Checklist

### 1. Supabase Configuration
Before deploying, ensure your Supabase project is properly configured:

#### Update Site URL in Supabase
1. Go to your Supabase dashboard
2. Navigate to **Authentication → URL Configuration**
3. Set **Site URL** to: `https://IamNotATuringMachine.github.io/fitness`

#### Configure Redirect URLs
1. In **Authentication → URL Configuration**
2. Add **Redirect URLs**:
   ```
   https://IamNotATuringMachine.github.io/fitness/auth/callback
   https://IamNotATuringMachine.github.io/fitness
   ```

#### OAuth Provider Configuration
If using Google/GitHub OAuth:

**For Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Edit your OAuth 2.0 Client
4. Add **Authorized redirect URIs**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
5. Add **Authorized JavaScript origins**:
   ```
   https://IamNotATuringMachine.github.io
   ```

**For GitHub OAuth:**
1. Go to GitHub **Settings → Developer settings → OAuth Apps**
2. Edit your OAuth App
3. Set **Authorization callback URL**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Set **Homepage URL**:
   ```
   https://IamNotATuringMachine.github.io/fitness
   ```

### 2. Environment Variables for Production

Since GitHub Pages doesn't support server-side environment variables, we need to handle this differently.

#### Option A: Build-time Environment Variables (Recommended)
Create a `.env.production` file in your project root:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Option B: GitHub Actions with Secrets (Most Secure)
1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add **Repository secrets**:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key

## 🔧 Deployment Methods

### Method 1: Manual Deployment (Quick)

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

3. **Verify deployment:**
   - Go to `https://IamNotATuringMachine.github.io/fitness`
   - Test authentication functionality

### Method 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
        REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

## 🔒 Security Considerations

### Environment Variables
- ✅ **REACT_APP_SUPABASE_URL**: Safe to expose (public)
- ✅ **REACT_APP_SUPABASE_ANON_KEY**: Safe to expose (public, rate-limited)
- ❌ **Service Role Key**: NEVER expose in frontend

### Row Level Security
Ensure RLS is enabled in Supabase:
```sql
-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_data', 'user_backups');
```

## 🧪 Testing Your Deployment

### 1. Basic Functionality Test
1. Visit your deployed app: `https://IamNotATuringMachine.github.io/fitness`
2. Try to access the app (should redirect to login)
3. Register a new account
4. Verify email confirmation works
5. Log in and test basic functionality

### 2. Authentication Flow Test
1. **Email/Password Login:**
   - Register with email/password
   - Check email for confirmation
   - Log in after confirmation

2. **Social Login (if configured):**
   - Try Google login
   - Try GitHub login
   - Verify redirect works correctly

3. **Data Sync Test:**
   - Create some workout data
   - Log out and log back in
   - Verify data persists
   - Try "Save to Cloud" and "Load from Cloud"

### 3. Cross-Device Test
1. Log in on one device/browser
2. Create some data
3. Log in on another device/browser
4. Verify data syncs automatically

## 🐛 Troubleshooting

### Common Issues:

#### 1. "Invalid API key" Error
**Cause:** Environment variables not set correctly
**Solution:**
- Check `.env.production` file exists
- Verify environment variables in GitHub secrets
- Restart build process

#### 2. OAuth Redirect Errors
**Cause:** Incorrect redirect URLs
**Solution:**
- Verify Supabase redirect URLs include your GitHub Pages domain
- Check OAuth provider settings
- Ensure URLs match exactly (including `/auth/callback`)

#### 3. "Site URL not allowed" Error
**Cause:** Supabase Site URL not configured
**Solution:**
- Set Site URL in Supabase to your GitHub Pages URL
- Add all necessary redirect URLs

#### 4. App Shows Login Form in Loop
**Cause:** Authentication state not persisting
**Solution:**
- Check browser console for errors
- Verify Supabase configuration
- Clear browser cache and cookies

#### 5. Data Not Syncing
**Cause:** Database policies or network issues
**Solution:**
- Check browser network tab for failed requests
- Verify RLS policies in Supabase
- Check user authentication status

### Debug Steps:

1. **Check Browser Console:**
   ```javascript
   // Open browser console and check for errors
   console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
   ```

2. **Verify Supabase Connection:**
   - Go to Supabase dashboard
   - Check **Authentication → Users** for registered users
   - Check **Database → user_data** for synced data

3. **Test API Endpoints:**
   - Check Network tab in browser dev tools
   - Look for failed requests to Supabase
   - Verify authentication headers

## 📱 Mobile Considerations

### PWA Features
Your app includes PWA functionality:
- **Offline Support:** App works offline with service worker
- **Install Prompt:** Users can install app on mobile devices
- **Push Notifications:** Ready for future implementation

### Mobile Testing
1. Test on mobile browsers (Chrome, Safari, Firefox)
2. Test PWA installation
3. Verify responsive design
4. Test touch interactions

## 🚀 Post-Deployment Steps

### 1. Monitor Usage
- Check Supabase dashboard for user registrations
- Monitor authentication success rates
- Watch for error patterns

### 2. Performance Optimization
- Enable Supabase connection pooling if needed
- Monitor API usage and optimize queries
- Consider implementing caching strategies

### 3. User Feedback
- Monitor user feedback for authentication issues
- Track data sync success rates
- Gather feedback on user experience

## 🔄 Continuous Deployment

### Automated Deployment Workflow
With GitHub Actions, your app will automatically deploy when you:
1. Push to main/master branch
2. Merge pull requests
3. Create releases

### Version Management
Consider using semantic versioning:
```bash
# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Push with tags
git push --follow-tags
```

## 📊 Analytics & Monitoring

### Supabase Analytics
Monitor in Supabase dashboard:
- **Authentication:** User sign-ups, logins, errors
- **Database:** Query performance, storage usage
- **API:** Request volume, response times

### Google Analytics (Optional)
Add Google Analytics to track:
- User engagement
- Feature usage
- Performance metrics

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Users can register and log in
- ✅ Data syncs across devices
- ✅ OAuth providers work correctly
- ✅ App works offline
- ✅ No authentication errors in console
- ✅ Mobile experience is smooth

## 🔮 Future Enhancements

Consider these improvements:
1. **Custom Domain:** Set up custom domain for better branding
2. **CDN:** Use Cloudflare for better performance
3. **Monitoring:** Add error tracking (Sentry, LogRocket)
4. **Analytics:** Implement user behavior tracking
5. **A/B Testing:** Test different authentication flows

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review Supabase documentation
3. Check GitHub Pages documentation
4. Create an issue in your repository

Your fitness app is now ready for production deployment with enterprise-grade authentication and data synchronization! 🎉 
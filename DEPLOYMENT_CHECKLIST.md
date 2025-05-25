# 🚀 GitHub Pages Deployment Checklist

## Pre-Deployment Setup

### 1. Supabase Configuration ✅
- [ ] Create Supabase project
- [ ] Set up database tables (run SQL from `SUPABASE_SETUP.md`)
- [ ] Configure Site URL: `https://IamNotATuringMachine.github.io/fitness`
- [ ] Add Redirect URLs:
  - `https://IamNotATuringMachine.github.io/fitness/auth/callback`
  - `https://IamNotATuringMachine.github.io/fitness`

### 2. Environment Variables ✅
- [ ] Create `.env.production` file with:
  ```env
  REACT_APP_SUPABASE_URL=https://your-project.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
  ```

### 3. OAuth Providers (Optional) ⚠️
- [ ] **Google OAuth:**
  - Configure in Google Cloud Console
  - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
  - Add authorized origin: `https://IamNotATuringMachine.github.io`
- [ ] **GitHub OAuth:**
  - Configure in GitHub Developer Settings
  - Set callback URL: `https://your-project.supabase.co/auth/v1/callback`

## Deployment Options

### Option A: Quick Manual Deployment 🚀
```bash
# Run the deployment script
./deploy.sh

# Or manually:
npm run build
npm run deploy
```

### Option B: Automated GitHub Actions 🤖
1. **Set up GitHub Secrets:**
   - Go to Repository Settings → Secrets and variables → Actions
   - Add secrets:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`

2. **Enable GitHub Pages:**
   - Go to Repository Settings → Pages
   - Source: GitHub Actions

3. **Push to trigger deployment:**
   ```bash
   git add .
   git commit -m "Deploy with authentication"
   git push origin main
   ```

## Post-Deployment Testing

### 1. Basic Functionality ✅
- [ ] Visit: `https://IamNotATuringMachine.github.io/fitness`
- [ ] App redirects to login form
- [ ] No console errors

### 2. Authentication Testing ✅
- [ ] **Email/Password:**
  - [ ] Register new account
  - [ ] Receive confirmation email
  - [ ] Login after confirmation
  - [ ] Password reset works

- [ ] **Social Login (if configured):**
  - [ ] Google login works
  - [ ] GitHub login works
  - [ ] Redirects work correctly

### 3. Data Sync Testing ✅
- [ ] Create workout data
- [ ] Logout and login
- [ ] Data persists
- [ ] "Save to Cloud" works
- [ ] "Load from Cloud" works

### 4. Cross-Device Testing ✅
- [ ] Login on different browser/device
- [ ] Data syncs automatically
- [ ] No authentication loops

## Troubleshooting

### Common Issues:
1. **"Invalid API key"** → Check environment variables
2. **OAuth redirect errors** → Verify redirect URLs
3. **Login loops** → Check Supabase Site URL
4. **Data not syncing** → Check RLS policies

### Debug Commands:
```bash
# Check build
npm run build

# Test locally first
npm start

# Check environment variables
echo $REACT_APP_SUPABASE_URL
```

## Success Criteria ✅

Your deployment is successful when:
- ✅ Users can register and login
- ✅ Data syncs across devices  
- ✅ No authentication errors
- ✅ Mobile experience works
- ✅ PWA features work offline

## Next Steps

After successful deployment:
1. **Monitor Supabase dashboard** for user activity
2. **Test on multiple devices** and browsers
3. **Gather user feedback** on authentication flow
4. **Monitor performance** and error rates
5. **Plan future enhancements**

---

**Your fitness app is ready for production! 🎉**

**Live URL:** `https://IamNotATuringMachine.github.io/fitness` 
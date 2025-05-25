# Authentication & API Issues Debug Guide

## Overview

This guide helps troubleshoot the authentication flow, Supabase API errors, and Service Worker caching issues identified in your FitTrack application.

## Issues Identified and Fixed

### 1. Service Worker Caching Errors ✅

**Problem**: Service Worker was attempting to cache POST requests, which is not supported by the Cache API.

**Symptoms**:
```
TypeError: Failed to execute 'put' on 'Cache': Request method 'POST' is unsupported
```

**Fix Applied**:
- Enhanced error handling in `public/sw.js`
- Added proper method filtering before caching attempts
- Improved logging for debugging
- Added fallback responses for different request types

**Verification**: Check browser console for `🔧 SW:` prefixed logs showing proper request handling.

### 2. Supabase API Errors ✅

**Problem**: 
- 406 (Not Acceptable) errors when fetching user data
- 400 (Bad Request) errors when saving user data
- Incorrect `upsert` syntax in SupabaseService

**Symptoms**:
```
Failed to load resource: the server responded with a status of 406
Failed to load resource: the server responded with a status of 400
```

**Fix Applied**:
- Corrected `upsert` syntax in `src/services/SupabaseService.js`
- Added proper error handling and detailed logging
- Enhanced parameter structure for Supabase calls
- Added `returning: 'minimal'` parameter for better performance

**Verification**: Check console for `🔧 SupabaseService:` prefixed logs showing successful API calls.

### 3. Authentication Flow Issues ✅

**Problem**: User signs in successfully but immediately signs out due to data sync failures.

**Symptoms**:
- User appears authenticated briefly then returns to login
- Data sync errors in console
- Inconsistent authentication state

**Fix Applied**:
- Added `syncUserDataOnSignIn` function to AuthContext
- Enhanced error handling for data sync (non-blocking)
- Improved logging throughout authentication flow
- Better state management during auth transitions

**Verification**: Check console for `🔧 AuthContext:` prefixed logs showing successful auth flow.

## Debug Tools Added

### 1. AuthDebugComponent

A comprehensive debug component that monitors:
- Authentication state in real-time
- API call logs and status
- Service Worker activity
- Console logs filtered for relevant issues

**Usage**: 
- Automatically appears in development mode
- Click the `+` button to expand
- Use action buttons to test specific functionality
- Export logs for detailed analysis

### 2. Enhanced Console Logging

All components now use `🔧` prefixed logs for easy filtering:
- `🔧 AuthContext:` - Authentication state changes
- `🔧 SupabaseService:` - API calls and responses  
- `🔧 SW:` - Service Worker activities
- `🔧 Debug:` - Debug component actions

## Database Setup

### Supabase Schema Required

Run the SQL script in `src/utils/supabase-schema.sql` in your Supabase SQL editor to create:

1. **user_data** table - Stores user workout and app data
2. **user_backups** table - Stores backup snapshots
3. **Row Level Security** policies for data protection
4. **Helper functions** for data management
5. **Indexes** for performance optimization

### Environment Variables

Ensure these are set in your environment:
```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Troubleshooting Steps

### If Authentication Still Fails:

1. **Check Supabase Configuration**:
   ```javascript
   console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
   console.log('Supabase Key configured:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
   ```

2. **Test Database Connection**:
   - Use the "Test Supabase" button in debug component
   - Check for database table existence
   - Verify RLS policies are correct

3. **Monitor Service Worker**:
   - Use "Test SW" button in debug component
   - Check if SW is active: `navigator.serviceWorker.ready`
   - Look for caching errors in Network tab

4. **Clear All Data**:
   - Use "Clear Data" button in debug component
   - Manually clear: localStorage, sessionStorage, IndexedDB
   - Unregister service worker if needed

### Common Error Patterns:

#### 406 Errors
- Usually content-type negotiation issues
- Check request headers and Accept headers
- Verify API endpoint URLs

#### 400 Errors  
- Invalid request parameters
- Check payload structure
- Verify required fields are present

#### Service Worker Errors
- Clear browser cache completely
- Unregister and re-register service worker
- Check for conflicting cache strategies

## Debug Console Commands

Open browser console and run:

```javascript
// Check auth state
console.log('Auth State:', window.__FITTRACK_AUTH_STATE__);

// Test Supabase connection
import { dataService } from './src/services/SupabaseService';
dataService.getUserData('test-id').then(console.log);

// Check service worker status
navigator.serviceWorker.getRegistration().then(console.log);

// Clear all app data
localStorage.clear();
sessionStorage.clear();
```

## Performance Monitoring

The debug component tracks:
- API call duration and success rates
- Authentication state transition timing
- Service Worker cache hit/miss ratios
- Error frequency and patterns

Use the "Export Logs" button to save detailed debugging information for analysis.

## Next Steps

1. **Monitor the enhanced logging** in browser console
2. **Use the debug component** to test specific functionality
3. **Run the Supabase schema script** if database issues persist
4. **Check network tab** for any remaining HTTP errors
5. **Export and analyze logs** if issues continue

The fixes should resolve the immediate authentication and API issues. The enhanced logging will help identify any remaining problems quickly.

## Support

If issues persist after following this guide:
1. Export logs using the debug component
2. Check the browser Network tab for HTTP errors
3. Verify Supabase dashboard for any service issues
4. Review the console for any uncaught errors not covered by our logging 
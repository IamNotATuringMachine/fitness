import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const disableSupabase = process.env.REACT_APP_DISABLE_SUPABASE === 'true';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key' &&
  !disableSupabase;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured properly!');
  console.warn('The app will run in offline mode without authentication.');
  console.warn('To enable Supabase:');
  console.warn('1. Create a .env file in your project root');
  console.warn('2. Add: REACT_APP_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('3. Add: REACT_APP_SUPABASE_ANON_KEY=your-anon-key');
  console.warn('4. Replace with your actual Supabase credentials');
  console.warn('Current values:', {
    url: supabaseUrl || 'undefined',
    key: supabaseKey ? '***configured***' : 'undefined',
    disabled: disableSupabase
  });
}

export const supabase = isSupabaseConfigured ? 
  createClient(supabaseUrl, supabaseKey) : 
  null;

export class SupabaseAuthService {
  async signUp(email, password, userData = {}) {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            ...userData
          }
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  }

  async signIn(email, password) {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  async signInWithGoogle() {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/fitness/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  }

  async signInWithGitHub() {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/fitness/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { data: null, error };
    }
  }

  async signOut() {
    if (!supabase) {
      return { 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  async resetPassword(email) {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/fitness/auth/reset-password`
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  }

  async updatePassword(newPassword) {
    if (!supabase) {
      return { 
        data: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  }

  async getCurrentUser() {
    if (!supabase) {
      return { 
        user: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      return { user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  }

  onAuthStateChange(callback) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured - auth state changes will not be monitored');
      // Return a mock subscription object that can be unsubscribed
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Mock auth state subscription unsubscribed');
            }
          }
        }
      };
    }
    return supabase.auth.onAuthStateChange(callback);
  }

  async getSession() {
    if (!supabase) {
      return { 
        session: null, 
        error: new Error('Supabase not configured. Please set environment variables.') 
      };
    }
    
    try {
      console.log('🔧 SupabaseService: Attempting supabase.auth.getSession() START');
      
      // Try to get the session with retry mechanism
      let session = null;
      let error = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const result = await supabase.auth.getSession();
          session = result.data?.session;
          error = result.error;
          
          if (session || !error) {
            break; // Success or clear no-session state
          }
          
          console.log(`🔧 SupabaseService: Session attempt ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Progressive delay
        } catch (attemptError) {
          console.warn(`🔧 SupabaseService: Session attempt ${attempt} error:`, attemptError);
          if (attempt === 3) {
            error = attemptError;
          }
        }
      }
      
      console.log('🔧 SupabaseService: Session retrieval result:', { 
        hasSession: !!session, 
        sessionValid: session && session.user && !this.isSessionExpired(session),
        error: error?.message || 'none',
        userId: session?.user?.id || 'none',
        expiresAt: session?.expires_at || 'none'
      });
      
      // Validate session if it exists
      if (session && this.isSessionExpired(session)) {
        console.warn('🔧 SupabaseService: Session is expired, treating as no session');
        return { session: null, error: null };
      }
      
      return { session, error };
    } catch (error) {
      console.error('🔧 SupabaseService: Get session error:', error);
      return { session: null, error };
    }
  }

  isSessionExpired(session) {
    if (!session || !session.expires_at) return false;
    const now = Math.floor(Date.now() / 1000);
    const expiryWithBuffer = session.expires_at - 300; // 5 minute buffer
    return now > expiryWithBuffer;
  }
}

export class SupabaseDataService {
  async saveUserData(userId, data) {
    console.log('🔧 SupabaseService: Attempting to save user data:', {
      userId,
      dataKeys: Object.keys(data),
      timestamp: new Date().toISOString()
    });

    if (!supabase) {
      console.error('🔧 SupabaseService: Supabase not configured');
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const now = new Date().toISOString();
      const payload = {
        user_id: userId,
        data: data,
        updated_at: now
      };

      console.log('🔧 SupabaseService: Payload prepared:', {
        user_id: payload.user_id,
        dataSize: JSON.stringify(payload.data).length,
        updated_at: payload.updated_at
      });

      // First check if a record exists
      console.log('🔧 SupabaseService: Checking if user record exists...');
      const { data: existingRecords, error: checkError } = await supabase
        .from('user_data')
        .select('id, user_id')
        .eq('user_id', userId);

      if (checkError) {
        console.error('🔧 SupabaseService: Error checking existing records:', checkError);
        throw checkError;
      }

      if (existingRecords && existingRecords.length > 0) {
        // Record exists, update it
        console.log('🔧 SupabaseService: Existing record found, updating...');
        const { data: updateResult, error: updateError } = await supabase
          .from('user_data')
          .update({
            data: payload.data,
            updated_at: payload.updated_at
          })
          .eq('user_id', userId)
          .select('id, user_id, updated_at');

        if (updateError) {
          console.error('🔧 SupabaseService: Update error details:', {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code
          });
          throw updateError;
        }

        console.log('🔧 SupabaseService: Data updated successfully:', {
          userId,
          recordsUpdated: updateResult?.length || 0
        });
        
        return { data: updateResult, error: null };
      } else {
        // No record exists, insert new one
        console.log('🔧 SupabaseService: No existing record found, inserting new record...');
        const { data: insertResult, error: insertError } = await supabase
          .from('user_data')
          .insert(payload)
          .select('id, user_id, updated_at');

        if (insertError) {
          console.error('🔧 SupabaseService: Insert error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw insertError;
        }

        console.log('🔧 SupabaseService: Data inserted successfully:', {
          userId,
          recordsInserted: insertResult?.length || 0
        });
        
        return { data: insertResult, error: null };
      }

    } catch (error) {
      console.error('🔧 SupabaseService: Save user data error:', {
        message: error.message,
        stack: error.stack,
        userId
      });
      return { data: null, error };
    }
  }

  async getUserData(userId) {
    console.log('🔧 SupabaseService: Attempting to get user data for:', userId);

    if (!supabase) {
      console.warn('🔧 SupabaseService: Supabase not configured - returning empty data');
      return { data: {}, error: null };
    }
    
    try {
      console.log('🔧 SupabaseService: Attempting supabase.from("user_data").select() START');
      
      // First try to get all records for this user (should be max 1 due to unique constraint)
      const { data: records, error } = await supabase
        .from('user_data')
        .select('id, user_id, data, created_at, updated_at')
        .eq('user_id', userId);
      
      console.log('🔧 SupabaseService: Attempting supabase.from("user_data").select() END', { 
        hasRecords: !!records, 
        recordCount: records?.length || 0, 
        error 
      });
      
      if (error) {
        console.error('🔧 SupabaseService: Get user data error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          userId
        });
        // Don't throw, return empty data instead
        return { data: {}, error: null };
      }

      // If no records found, return empty data (normal for new users)
      if (!records || records.length === 0) {
        console.log('🔧 SupabaseService: No existing user data found (expected for new users)');
        return { data: {}, error: null };
      }

      // Get the first (and should be only) record
      const userData = records[0];
      
      console.log('🔧 SupabaseService: User data retrieved successfully:', {
        userId,
        hasData: !!userData,
        dataKeys: userData?.data ? Object.keys(userData.data) : []
      });
      
      return { data: userData?.data || {}, error: null };
    } catch (error) {
      console.error('🔧 SupabaseService: Get user data error:', {
        message: error.message,
        stack: error.stack,
        userId
      });
      return { data: {}, error: null };
    }
  }

  async getUserDataChangesSince(userId, timestamp) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .gte('updated_at', timestamp);
      
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user data changes error:', error);
      return { data: [], error };
    }
  }

  async deleteUserData(userId) {
    try {
      const { error } = await supabase
        .from('user_data')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Delete user data error:', error);
      return { error };
    }
  }

  // Real-time subscription for data changes
  subscribeToUserData(userId, callback) {
    return supabase
      .channel(`user_data_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_data',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  // Backup functionality
  async createBackup(userId, backupData) {
    try {
      const { data, error } = await supabase
        .from('user_backups')
        .insert({
          user_id: userId,
          backup_data: backupData,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Create backup error:', error);
      return { data: null, error };
    }
  }

  async getUserBackups(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('user_backups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user backups error:', error);
      return { data: [], error };
    }
  }
}

// Create singleton instances
export const authService = new SupabaseAuthService();
export const dataService = new SupabaseDataService(); 
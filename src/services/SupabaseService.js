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
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔧 SupabaseService: Attempting supabase.auth.getSession() END', { hasSession: !!session, error });
      if (error) throw error;
      
      return { session, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error };
    }
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
      const payload = {
        user_id: userId,
        data: data,
        updated_at: new Date().toISOString()
      };

      console.log('🔧 SupabaseService: Payload prepared:', {
        user_id: payload.user_id,
        dataSize: JSON.stringify(payload.data).length,
        updated_at: payload.updated_at
      });

      // Try update first, then insert if no record exists
      const { data: updateResult, error: updateError, count } = await supabase
        .from('user_data')
        .update({
          data: payload.data,
          updated_at: payload.updated_at
        })
        .eq('user_id', userId)
        .select('*');

      if (updateError) {
        console.error('🔧 SupabaseService: Update error:', updateError);
        throw updateError;
      }

      // If no rows were updated, insert a new record
      if (!updateResult || updateResult.length === 0) {
        console.log('🔧 SupabaseService: No existing record found, inserting new record');
        
        const { data: insertResult, error: insertError } = await supabase
          .from('user_data')
          .insert(payload)
          .select('*');

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
          result: insertResult
        });
        
        return { data: insertResult, error: null };
      } else {
        console.log('🔧 SupabaseService: Data updated successfully:', {
          userId,
          result: updateResult
        });
        
        return { data: updateResult, error: null };
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
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();
      console.log('🔧 SupabaseService: Attempting supabase.from("user_data").select() END', { hasData: !!data, error });
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('🔧 SupabaseService: No existing user data found (expected for new users)');
          return { data: {}, error: null };
        }
        console.error('🔧 SupabaseService: Get user data error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          userId
        });
        throw error;
      }

      console.log('🔧 SupabaseService: User data retrieved successfully:', {
        userId,
        hasData: !!data,
        dataKeys: data?.data ? Object.keys(data.data) : []
      });
      
      return { data: data?.data || {}, error: null };
    } catch (error) {
      console.error('🔧 SupabaseService: Get user data error:', {
        message: error.message,
        stack: error.stack,
        userId
      });
      return { data: {}, error };
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
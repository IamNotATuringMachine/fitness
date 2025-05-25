import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseAuthService {
  async signUp(email, password, userData = {}) {
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
    return supabase.auth.onAuthStateChange(callback);
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
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
    try {
      const { data: result, error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          data: data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      return { data: result, error: null };
    } catch (error) {
      console.error('Save user data error:', error);
      return { data: null, error };
    }
  }

  async getUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return { data: data?.data || {}, error: null };
    } catch (error) {
      console.error('Get user data error:', error);
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
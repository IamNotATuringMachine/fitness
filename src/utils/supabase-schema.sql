-- FitTrack Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to create the necessary tables

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create user_data table for storing user workout and app data
CREATE TABLE IF NOT EXISTS public.user_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user
    UNIQUE(user_id)
);

-- Create user_backups table for backup functionality
CREATE TABLE IF NOT EXISTS public.user_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    backup_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    backup_name TEXT,
    backup_size INTEGER,
    
    -- Index for efficient querying
    INDEX (user_id, created_at DESC)
);

-- Enable Row Level Security
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_backups ENABLE ROW LEVEL SECURITY;

-- Create policies for user_data table
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON public.user_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON public.user_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON public.user_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON public.user_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_backups table
-- Users can only access their own backups
CREATE POLICY "Users can view own backups" ON public.user_backups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own backups" ON public.user_backups
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own backups" ON public.user_backups
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_updated_at ON public.user_data(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_backups_user_id ON public.user_backups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_backups_created_at ON public.user_backups(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on user_data
DROP TRIGGER IF EXISTS trigger_user_data_updated_at ON public.user_data;
CREATE TRIGGER trigger_user_data_updated_at
    BEFORE UPDATE ON public.user_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_data TO authenticated;
GRANT ALL ON public.user_backups TO authenticated;

-- Optional: Create a view for user data with metadata
CREATE OR REPLACE VIEW public.user_data_with_metadata AS
SELECT 
    ud.id,
    ud.user_id,
    ud.data,
    ud.created_at,
    ud.updated_at,
    au.email,
    jsonb_object_keys(ud.data) as data_keys,
    pg_size_pretty(pg_total_relation_size('public.user_data')) as table_size
FROM public.user_data ud
LEFT JOIN auth.users au ON ud.user_id = au.id;

-- Grant select permission on the view
GRANT SELECT ON public.user_data_with_metadata TO authenticated;

-- Create a function to get user data statistics
CREATE OR REPLACE FUNCTION public.get_user_data_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_records', COUNT(*),
        'data_size_bytes', SUM(octet_length(data::text)),
        'last_updated', MAX(updated_at),
        'created_at', MIN(created_at),
        'backup_count', (
            SELECT COUNT(*) 
            FROM public.user_backups 
            WHERE user_id = user_uuid
        )
    ) INTO result
    FROM public.user_data
    WHERE user_id = user_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_data_stats(UUID) TO authenticated;

-- Create a function for safe user data cleanup (for GDPR compliance)
CREATE OR REPLACE FUNCTION public.cleanup_user_data(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Only allow users to clean their own data
    IF auth.uid() != user_uuid THEN
        RAISE EXCEPTION 'Unauthorized: Can only clean your own data';
    END IF;
    
    -- Delete user backups
    DELETE FROM public.user_backups WHERE user_id = user_uuid;
    
    -- Delete user data
    DELETE FROM public.user_data WHERE user_id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the cleanup function
GRANT EXECUTE ON FUNCTION public.cleanup_user_data(UUID) TO authenticated;

-- Insert some helpful comments
COMMENT ON TABLE public.user_data IS 'Stores user workout plans, history, and app preferences as JSONB';
COMMENT ON TABLE public.user_backups IS 'Stores backup snapshots of user data for recovery purposes';
COMMENT ON FUNCTION public.get_user_data_stats(UUID) IS 'Returns statistics about a users stored data';
COMMENT ON FUNCTION public.cleanup_user_data(UUID) IS 'Safely removes all user data for GDPR compliance';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'FitTrack database schema created successfully!';
    RAISE NOTICE 'Tables created: user_data, user_backups';
    RAISE NOTICE 'RLS policies enabled for data security';
    RAISE NOTICE 'Helper functions and views created';
END
$$; 
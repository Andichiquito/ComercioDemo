
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ehbusrkpnzrbimkvrzgb.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYnVzcmtwbnpyYmlta3ZyemdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzkyNzEsImV4cCI6MjA4MDQ1NTI3MX0.yVqNd3ZbyFAhmfXX94BWiqpPPbAu0YcfXTwwM6Xua4g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

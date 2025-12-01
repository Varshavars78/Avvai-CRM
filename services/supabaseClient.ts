
import { createClient } from '@supabase/supabase-js';

// NOTE: In a real app, these should be in a .env file
// For now, we keep them empty or placeholders until you provide the real keys
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

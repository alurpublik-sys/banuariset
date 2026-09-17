import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyktqhhwwxoswvrbpbil.supabase.co';
const supabasePublishableKey = 'sb_publishable_dv5VV7hQlB4Db1x6HaXgBg_2uSWHV9o';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyktqhhwwxoswvrbpbil.supabase.co';
const supabasePublishableKey = 'sb_publishable_dv5VV7hQlB4Db1x6HaXgBg_2uSWHV9o';

const PIN_KEY = 'banua_admin_pin';
const ADMIN_ID_KEY = 'banua_admin_user_id';

const baseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: async (input, init = {}) => {
      const headers = new Headers(init.headers || {});
      if (typeof window !== 'undefined') {
        const pin = window.localStorage.getItem(PIN_KEY);
        if (pin) headers.set('x-banua-admin-pin', pin);
      }
      return fetch(input, { ...init, headers });
    },
  },
});

const fakeAuth = new Proxy(baseClient.auth as any, {
  get(target, prop, receiver) {
    if (prop === 'getSession') {
      return async () => {
        if (typeof window !== 'undefined') {
          const pin = window.localStorage.getItem(PIN_KEY);
          const userId = window.localStorage.getItem(ADMIN_ID_KEY);
          if (pin && userId) {
            return {
              data: {
                session: {
                  access_token: 'pin-session',
                  refresh_token: '',
                  expires_in: 86400,
                  expires_at: Math.floor(Date.now() / 1000) + 86400,
                  token_type: 'bearer',
                  user: { id: userId, aud: 'authenticated', role: 'authenticated' },
                },
              },
              error: null,
            };
          }
        }
        return { data: { session: null }, error: null };
      };
    }
    if (prop === 'signOut') {
      return async () => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(PIN_KEY);
          window.localStorage.removeItem(ADMIN_ID_KEY);
        }
        return { error: null };
      };
    }
    return Reflect.get(target, prop, receiver);
  },
});

export const supabase: any = new Proxy(baseClient as any, {
  get(target, prop, receiver) {
    if (prop === 'auth') return fakeAuth;
    return Reflect.get(target, prop, receiver);
  },
});

export function saveAdminPin(pin: string, userId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PIN_KEY, pin);
  window.localStorage.setItem(ADMIN_ID_KEY, userId);
}

export function clearAdminPin() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PIN_KEY);
  window.localStorage.removeItem(ADMIN_ID_KEY);
}

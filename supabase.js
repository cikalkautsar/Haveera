import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://dqocxsyonclrrqaccqsk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxb2N4c3lvbmNscnJxYWNjcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQ4MzksImV4cCI6MjA5ODMxMDgzOX0.bDM8Lr2lkHdPtG7ULO-VEokAgefjZmWTDOLMklnP_kk';

const isServer = typeof window === 'undefined';
const storage = isServer ? undefined : Platform.OS === 'web' ? window.localStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

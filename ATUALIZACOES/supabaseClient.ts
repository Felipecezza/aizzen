import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtcchttcvmaijvjjcxpu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y2NodHRjdm1haWp2ampjeHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2OTM2MzcsImV4cCI6MjA0NzI2OTYzN30.nXX3e8TPfHwJZvtffI4XzA9um7v8Rp_9uhHtZSVtW5Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY); 
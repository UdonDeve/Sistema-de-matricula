
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsguvpdvhxewqyinyami.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ3V2cGR2aHhld3F5aW55YW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwODMxMDMsImV4cCI6MjA0MDY1OTEwM30.egLOd4a24Ji6TUctCvZsUtDjaI5YmtpuDo-YG41aYxk'; // Reemplaza con tu clave Anónima

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

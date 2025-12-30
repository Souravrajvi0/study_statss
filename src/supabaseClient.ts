import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables!",
    "\nVITE_SUPABASE_URL:", supabaseUrl ? "✓" : "✗",
    "\nVITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗",
    "\n\nPlease set these in Netlify: Site settings → Environment variables"
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
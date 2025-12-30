import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://thfstrtwfzrkjaasintd.supabase.co";
const supabaseAnonKey = "sb_publishable_St3zz3T_GEj1yXN16ElfHA_Eo08TXTH";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
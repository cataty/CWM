import { createClient } from "@supabase/supabase-js";

/* const supabase = createClient<Database>(  
    process.env.SUPABASE_URL,  
    process.env.SUPABASE_ANON_KEY
) */

const SUPABASE_PROJECT = "https://iqwtybltztrnruefdlay.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxd3R5Ymx0enRybnJ1ZWZkbGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDM5NTUsImV4cCI6MjA1OTcxOTk1NX0.KKLjcrDPwJnl3bsT4RgT6JoIm9VD82AMiJbpaDUnEuk";
const supabase = createClient(SUPABASE_PROJECT, SUPABASE_KEY);

export default supabase;
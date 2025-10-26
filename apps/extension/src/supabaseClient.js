// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wzzlkcfytxzccrcyavju.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6emxrY2Z5dHh6Y2NyY3lhdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDY4MjMsImV4cCI6MjA3NjkyMjgyM30.LVXzxQF5DzXXWn-zpLphl2v_83WtcT3fyMrv--KT1LY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
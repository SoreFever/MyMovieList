import { supabase } from "@/app/lib/supabase";

await supabase.auth.signInWithPassword({ email: "", password: "" });

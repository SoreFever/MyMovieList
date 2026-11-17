"use client";

import { supabase } from "@/app/lib/supabase";

export default function SignOutButton() {
  return <button onClick={() => supabase.auth.signOut()}>Sign out</button>;
}

"use client";

import { supabase } from "@/app/lib/supabase";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  return (
    <Button
      onClick={() => {
        supabase.auth.signOut();
        redirect("/login");
      }}
    >
      Log out
    </Button>
  );
}

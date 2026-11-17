"use client";

import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default function AuthLinks() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return loggedIn ? (
    <SignOutButton />
  ) : (
    <>
      <Link href="/signup">Sign up</Link>
      <Link href="/login">Login</Link>
    </>
  );
}

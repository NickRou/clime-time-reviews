"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?message=Invalid email or password");
  }

  revalidatePath("/", "layout"); // clears all cache data
  redirect("/");
}

export async function signup(
  email: string,
  password: string,
  displayName: string
) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/login?message=Error signing up");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

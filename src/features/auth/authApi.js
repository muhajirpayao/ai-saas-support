// src/features/auth/authApi.js
import { supabase } from "@/lib/supabase";

/**
 * Sign up a new user and create their profile + organization rows.
 */
export async function signUp(email, password, fullName, companyName) {
  // 1. Create the auth user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("Sign-up succeeded but no user ID was returned.");

  // 2. Insert profile row (profiles.id = auth.users.id)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: fullName,
    role: "admin",
  });
  if (profileError) throw profileError;

  // 3. Optionally create an organization if companyName was provided
  if (companyName) {
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: companyName })
      .select("id")
      .single();
    if (orgError) throw orgError;

    // 4. Link profile to the new org
    await supabase
      .from("profiles")
      .update({ organization_id: orgData.id })
      .eq("id", userId);
  }

  return data; // { user, session }
}

/**
 * Sign in an existing user with email + password.
 * Throws if credentials are wrong or the account doesn't exist.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data; // { user, session }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
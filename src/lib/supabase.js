import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ---- Auth helpers ----

export async function signUp(email, password, name, tier) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, tier } },
  });
  if (error) return { error };
  // Upsert profile row
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name,
      tier,
      email,
    });
  }
  return { data };
}

export async function signIn(email, password) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) return;
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return { data: { session: null } };
  return supabase.auth.getSession();
}

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(userId, updates) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  return supabase.from("profiles").update(updates).eq("id", userId);
}

export async function updateEmail(newEmail) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  return supabase.auth.updateUser({ email: newEmail });
}

export async function updatePassword(newPassword) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  return supabase.auth.updateUser({ password: newPassword });
}

export async function deleteAccount(userId) {
  if (!supabase) return { error: { message: "Supabase not configured" } };
  // Delete saved restaurants and profile — the user row is handled by Supabase auth
  await supabase.from("saved_restaurants").delete().eq("user_id", userId);
  await supabase.from("profiles").delete().eq("id", userId);
  return supabase.auth.signOut();
}

// ---- Saved restaurants helpers ----

export async function loadSaved(userId) {
  if (!supabase) return {};
  const { data } = await supabase
    .from("saved_restaurants")
    .select("*")
    .eq("user_id", userId);
  if (!data) return {};
  const saved = {};
  data.forEach((row) => {
    saved[row.restaurant_key] = {
      status: row.status,
      rating: row.rating,
      note: row.note,
    };
  });
  return saved;
}

export async function saveToDB(userId, key, saveData) {
  if (!supabase) return;
  await supabase.from("saved_restaurants").upsert({
    user_id: userId,
    restaurant_key: key,
    status: saveData.status,
    rating: saveData.rating || 0,
    note: saveData.note || "",
  });
}

export async function removeFromDB(userId, key) {
  if (!supabase) return;
  await supabase
    .from("saved_restaurants")
    .delete()
    .eq("user_id", userId)
    .eq("restaurant_key", key);
}

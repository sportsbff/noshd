-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- This creates the tables needed for noshd user accounts and saved restaurants

-- 1. Profiles table — stores user display name and tier
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Saved restaurants table — stores user's saved/favorited restaurants
CREATE TABLE IF NOT EXISTS saved_restaurants (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_key TEXT NOT NULL,  -- format: "Country||Restaurant Name"
  status TEXT NOT NULL DEFAULT 'want' CHECK (status IN ('want', 'visited', 'favorite')),
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, restaurant_key)
);

-- 3. Enable Row Level Security (RLS) — users can only access their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_restaurants ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Saved restaurants: users can CRUD their own saved restaurants
CREATE POLICY "Users can view own saves" ON saved_restaurants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saves" ON saved_restaurants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saves" ON saved_restaurants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saves" ON saved_restaurants
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER saved_restaurants_updated_at
  BEFORE UPDATE ON saved_restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

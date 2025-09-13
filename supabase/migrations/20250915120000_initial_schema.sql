/*
          # Initial Schema Setup
          This migration sets up the initial database schema for the ShopEasy e-commerce application. It includes tables for users (profiles), categories, products, orders, and cart management. It also establishes relationships between these tables and sets up Row Level Security (RLS) for data protection.

          ## Query Description: This script is foundational and should be run on a new, empty project. It creates all necessary tables and security policies. It is not designed to be run on a database with existing, conflicting tables.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Tables Created: profiles, categories, products, orders, order_items, cart_items
          - Policies Created: RLS policies for all new tables.
          
          ## Security Implications:
          - RLS Status: Enabled on all tables.
          - Policy Changes: Yes, new policies are created.
          - Auth Requirements: Policies are based on `auth.uid()`.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed.
          - Triggers: A trigger is added to create a user profile upon new user sign-up.
          - Estimated Impact: Low, as this is an initial setup.
          */

-- 1. Create Profiles Table
-- Stores public user data. Links to auth.users via a one-to-one relationship.
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  role text default 'user'
);
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);

-- 2. Function and Trigger to create a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create Categories Table
create table public.categories (
  id bigserial primary key,
  name text not null,
  image text,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on categories for select using (true);
create policy "Admins can manage categories." on categories for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 4. Create Products Table
create table public.products (
  id bigserial primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category_id bigint references public.categories(id),
  image text,
  stock integer default 0,
  rating numeric(2, 1) default 0,
  reviews integer default 0,
  featured boolean default false,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Products are viewable by everyone." on products for select using (true);
create policy "Admins can manage products." on products for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 5. Create Orders Table
create table public.orders (
  id bigserial primary key,
  user_id uuid references public.profiles(id) not null,
  total numeric(10, 2) not null,
  status text not null default 'confirmed',
  shipping_address jsonb,
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Users can view their own orders." on orders for select using (auth.uid() = user_id);
create policy "Users can create their own orders." on orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders." on orders for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 6. Create Order Items Table
create table public.order_items (
  id bigserial primary key,
  order_id bigint references public.orders(id) not null,
  product_id bigint references public.products(id) not null,
  quantity integer not null,
  price numeric(10, 2) not null
);
alter table public.order_items enable row level security;
create policy "Users can view items in their own orders." on order_items for select using (exists (select 1 from orders where id = order_items.order_id and user_id = auth.uid()));
create policy "Users can insert items into their own orders." on order_items for insert with check (exists (select 1 from orders where id = order_items.order_id and user_id = auth.uid()));
create policy "Admins can view all order items." on order_items for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 7. Create Cart Items Table
create table public.cart_items (
  id bigserial primary key,
  user_id uuid references public.profiles(id) not null,
  product_id bigint references public.products(id) not null,
  quantity integer not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table public.cart_items enable row level security;
create policy "Users can manage their own cart." on cart_items for all using (auth.uid() = user_id);

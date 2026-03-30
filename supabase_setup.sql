-- 0. Clean up existing tables (since the project is new)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.toppings CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    colSpan TEXT NOT NULL DEFAULT 'col-span-1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert existing products
INSERT INTO public.products (name, description, image, colSpan) VALUES
('Original Caramel', 'The classic taste that started it all. Smooth vanilla custard with rich caramel syrup.', '/images/products/OriginalCaramel.jpeg', 'col-span-1 md:col-span-2'),
('Creamy Vanilla', 'Pure Madagascar vanilla bean creates a speckled, fragrant delicacy.', '/images/products/CreamyVanilla.jpeg', 'col-span-1'),
('Belgian Chocolate', 'Decadent dark chocolate layered with milk chocolate silk.', '/images/products/BelgianChocolate.jpeg', 'col-span-1'),
('Kyoto Matcha', 'Premium ceremonial grade matcha imported from Japan.', '/images/products/KyotoMatcha.jpeg', 'col-span-1 md:col-span-2');

-- 2. Create Toppings Table
CREATE TABLE IF NOT EXISTS public.toppings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert existing toppings
INSERT INTO public.toppings (name, description, emoji) VALUES
('Oreo Crumb', 'Crumble biskuit Oreo klasik yang renyah.', '🍪'),
('Lotus Biscoff', 'Remahan biskuit karamel premium.', '🤎'),
('Keju Parut', 'Taburan keju cheddar merah yang gurih.', '🧀'),
('Milo Powder', 'Bubuk cokelat malt yang manis manis legit.', '🍫');

-- 3. Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert existing testimonials
INSERT INTO public.testimonials (quote, author, role) VALUES
('Puding paling creamy yang pernah saya rasakan. Seperti awan yang meleleh di mulut.', 'Sarah J.', 'Food Blogger'),
('Kualitas premium yang sesungguhnya. Rasa karamelnya sangat pas berpadu dengan teksturnya yang lembut.', 'Michael T.', 'Pecinta Dessert'),
('Pudingholic sudah jadi camilan favorit keluarga kami setiap akhir pekan. Selalu enak.', 'Elena R.', 'Pelanggan Setia');

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read Access)
CREATE POLICY "Allow public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert for products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for products" ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete for products" ON public.products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public read access for toppings" ON public.toppings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert for toppings" ON public.toppings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for toppings" ON public.toppings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete for toppings" ON public.toppings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public read access for testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert for testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete for testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);

-- 4. Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;

-- 5. Storage Access Policies
-- Note: Replace role authenticated with logic to allow insert if you're executing this as a superuser/admin.
CREATE POLICY "Allow public read access for storage products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Allow authenticated uploads for storage products" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');
CREATE POLICY "Allow authenticated updates for storage products" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products');
CREATE POLICY "Allow authenticated deletes for storage products" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');

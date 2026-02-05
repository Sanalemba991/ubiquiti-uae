-- Supabase Database Schema for Ubiquiti UAE
-- Run this in your Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE enquiry_status AS ENUM ('pending', 'contacted', 'resolved');
CREATE TYPE notification_type AS ENUM ('product', 'product_enquiry', 'contact_enquiry', 'category', 'subcategory', 'navbar_category', 'info', 'success', 'warning', 'error');

-- Navbar Categories Table
CREATE TABLE navbar_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    navbar_category_id UUID NOT NULL REFERENCES navbar_categories(id) ON DELETE CASCADE,
    description TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories Table
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    description TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    key_features TEXT[] DEFAULT '{}',
    image1 VARCHAR(500) NOT NULL,
    image2 VARCHAR(500),
    image3 VARCHAR(500),
    image4 VARCHAR(500),
    navbar_category_id UUID NOT NULL REFERENCES navbar_categories(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Enquiries Table
CREATE TABLE contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status enquiry_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Enquiries Table
CREATE TABLE product_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status enquiry_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    icon VARCHAR(100) NOT NULL,
    link VARCHAR(500),
    read BOOLEAN DEFAULT false,
    urgent BOOLEAN DEFAULT false,
    related_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_navbar_categories_slug ON navbar_categories(slug);
CREATE INDEX idx_navbar_categories_is_active ON navbar_categories(is_active);
CREATE INDEX idx_navbar_categories_order ON navbar_categories("order");

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_navbar_category ON categories(navbar_category_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_order ON categories("order");

CREATE INDEX idx_subcategories_slug ON subcategories(slug);
CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_subcategories_is_active ON subcategories(is_active);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_navbar_category ON products(navbar_category_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

CREATE INDEX idx_contact_enquiries_status ON contact_enquiries(status);
CREATE INDEX idx_contact_enquiries_created_at ON contact_enquiries(created_at DESC);

CREATE INDEX idx_product_enquiries_status ON product_enquiries(status);
CREATE INDEX idx_product_enquiries_created_at ON product_enquiries(created_at DESC);

CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_navbar_categories_updated_at BEFORE UPDATE ON navbar_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_enquiries_updated_at BEFORE UPDATE ON contact_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_enquiries_updated_at BEFORE UPDATE ON product_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE navbar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for active items (for the frontend)
CREATE POLICY "Public can view active navbar categories" ON navbar_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active subcategories" ON subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);

-- Public can create enquiries
CREATE POLICY "Public can create contact enquiries" ON contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create product enquiries" ON product_enquiries FOR INSERT WITH CHECK (true);

-- Service role (admin) has full access - these policies allow the service_role to bypass RLS
CREATE POLICY "Service role full access navbar_categories" ON navbar_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access subcategories" ON subcategories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access contact_enquiries" ON contact_enquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_enquiries" ON product_enquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');

-- Create Storage Bucket for images
-- Run this in Supabase Dashboard > Storage > Create new bucket
-- Bucket name: images
-- Public bucket: Yes (for serving images publicly)

-- Storage Policies (run these after creating the bucket)
-- These allow public read and authenticated upload/delete

-- Note: Storage bucket policies must be created in the Supabase Dashboard
-- or via the Storage API. Here's what you need to set up:
--
-- Bucket: "images" (public)
-- Policies:
-- 1. Allow public read access: SELECT for anon and authenticated
-- 2. Allow authenticated upload: INSERT for authenticated users
-- 3. Allow authenticated delete: DELETE for authenticated users

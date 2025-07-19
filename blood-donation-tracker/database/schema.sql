-- Digital Blood Donation Tracker Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE blood_type_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE user_role_enum AS ENUM ('donor', 'hospital', 'admin');
CREATE TYPE request_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE request_status_enum AS ENUM ('open', 'fulfilled', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role_enum NOT NULL DEFAULT 'donor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    blood_type blood_type_enum NOT NULL,
    date_of_birth DATE NOT NULL,
    weight_kg INTEGER,
    last_donation_date DATE,
    next_eligible_date DATE,
    medical_conditions TEXT[],
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals table
CREATE TABLE public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    capacity INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood inventory table
CREATE TABLE public.blood_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    blood_type blood_type_enum NOT NULL,
    units_available INTEGER NOT NULL DEFAULT 0,
    units_reserved INTEGER NOT NULL DEFAULT 0,
    expiry_date DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hospital_id, blood_type)
);

-- Blood requests table
CREATE TABLE public.blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    blood_type blood_type_enum NOT NULL,
    units_needed INTEGER NOT NULL,
    units_fulfilled INTEGER DEFAULT 0,
    priority request_priority_enum NOT NULL DEFAULT 'medium',
    status request_status_enum NOT NULL DEFAULT 'open',
    reason TEXT,
    needed_by TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    blood_request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
    donation_date DATE NOT NULL,
    units_donated INTEGER NOT NULL DEFAULT 1,
    blood_type blood_type_enum NOT NULL,
    hemoglobin_level DECIMAL(3,1),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'urgent_request', 'eligibility_reminder', 'donation_confirmation', etc.
    is_read BOOLEAN DEFAULT false,
    related_id UUID, -- Can reference blood_requests, donations, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_donors_blood_type ON public.donors(blood_type);
CREATE INDEX idx_donors_next_eligible_date ON public.donors(next_eligible_date);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX idx_blood_requests_priority ON public.blood_requests(priority);
CREATE INDEX idx_blood_requests_blood_type ON public.blood_requests(blood_type);
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_hospital_id ON public.donations(hospital_id);
CREATE INDEX idx_donations_date ON public.donations(donation_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Donors can read their own data
CREATE POLICY "Donors can read own data" ON public.donors
    FOR SELECT USING (auth.uid() = user_id);

-- Donors can update their own data
CREATE POLICY "Donors can update own data" ON public.donors
    FOR UPDATE USING (auth.uid() = user_id);

-- Hospitals can read their own data
CREATE POLICY "Hospitals can read own data" ON public.hospitals
    FOR SELECT USING (auth.uid() = user_id);

-- Everyone can read verified hospitals
CREATE POLICY "Everyone can read verified hospitals" ON public.hospitals
    FOR SELECT USING (is_verified = true);

-- Blood inventory is readable by everyone
CREATE POLICY "Blood inventory is readable" ON public.blood_inventory
    FOR SELECT TO authenticated USING (true);

-- Hospitals can manage their own inventory
CREATE POLICY "Hospitals can manage own inventory" ON public.blood_inventory
    FOR ALL USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE user_id = auth.uid()
        )
    );

-- Blood requests are readable by everyone
CREATE POLICY "Blood requests are readable" ON public.blood_requests
    FOR SELECT TO authenticated USING (true);

-- Hospitals can manage their own requests
CREATE POLICY "Hospitals can manage own requests" ON public.blood_requests
    FOR ALL USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE user_id = auth.uid()
        )
    );

-- Donations are readable by donors and hospitals involved
CREATE POLICY "Donations readable by involved parties" ON public.donations
    FOR SELECT USING (
        donor_id IN (SELECT id FROM public.donors WHERE user_id = auth.uid())
        OR hospital_id IN (SELECT id FROM public.hospitals WHERE user_id = auth.uid())
    );

-- Donors can create donations
CREATE POLICY "Donors can create donations" ON public.donations
    FOR INSERT WITH CHECK (
        donor_id IN (SELECT id FROM public.donors WHERE user_id = auth.uid())
    );

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON public.blood_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next eligible donation date
CREATE OR REPLACE FUNCTION calculate_next_eligible_date(last_donation DATE)
RETURNS DATE AS $$
BEGIN
    -- Standard waiting period is 56 days (8 weeks) for whole blood donation
    RETURN last_donation + INTERVAL '56 days';
END;
$$ LANGUAGE plpgsql;

-- Function to update donor eligibility after donation
CREATE OR REPLACE FUNCTION update_donor_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.donors 
    SET 
        last_donation_date = NEW.donation_date,
        next_eligible_date = calculate_next_eligible_date(NEW.donation_date)
    WHERE id = NEW.donor_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update donor eligibility after donation
CREATE TRIGGER update_donor_after_donation
    AFTER INSERT ON public.donations
    FOR EACH ROW EXECUTE FUNCTION update_donor_eligibility();

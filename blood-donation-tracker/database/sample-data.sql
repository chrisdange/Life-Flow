-- Sample data for testing the Blood Donation Tracker
-- Run this AFTER setting up the main schema and creating some test users

-- Sample hospitals (you'll need to create hospital users first in Supabase Auth)
INSERT INTO public.hospitals (user_id, name, license_number, address, city, state, zip_code, phone, email, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'City General Hospital', 'CGH-2024-001', '123 Main Street', 'New York', 'NY', '10001', '+1-555-0101', 'contact@citygeneral.com', true),
('00000000-0000-0000-0000-000000000002', 'Metro Medical Center', 'MMC-2024-002', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', '+1-555-0102', 'info@metromedical.com', true),
('00000000-0000-0000-0000-000000000003', 'Regional Blood Bank', 'RBB-2024-003', '789 Pine Road', 'Chicago', 'IL', '60601', '+1-555-0103', 'admin@regionalblood.org', true);

-- Sample blood inventory
INSERT INTO public.blood_inventory (hospital_id, blood_type, units_available, units_reserved, expiry_date) VALUES
-- City General Hospital
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'O+', 25, 5, '2024-08-15'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'O-', 8, 2, '2024-08-10'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'A+', 15, 3, '2024-08-20'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'A-', 6, 1, '2024-08-18'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'B+', 12, 2, '2024-08-22'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'B-', 4, 0, '2024-08-16'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'AB+', 7, 1, '2024-08-25'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'AB-', 3, 0, '2024-08-14'),

-- Metro Medical Center
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'O+', 30, 8, '2024-08-17'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'O-', 5, 3, '2024-08-12'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'A+', 20, 4, '2024-08-19'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'A-', 8, 2, '2024-08-21'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'B+', 10, 1, '2024-08-23'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'B-', 6, 1, '2024-08-15'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'AB+', 4, 2, '2024-08-24'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'AB-', 2, 1, '2024-08-13'),

-- Regional Blood Bank
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'O+', 45, 10, '2024-08-26'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'O-', 12, 4, '2024-08-20'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'A+', 35, 7, '2024-08-28'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'A-', 15, 3, '2024-08-25'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'B+', 18, 4, '2024-08-30'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'B-', 9, 2, '2024-08-22'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'AB+', 11, 3, '2024-08-27'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'AB-', 6, 1, '2024-08-24');

-- Sample blood requests
INSERT INTO public.blood_requests (hospital_id, blood_type, units_needed, priority, reason, needed_by) VALUES
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'O-', 5, 'urgent', 'Emergency surgery - multiple trauma patients', '2024-07-15 18:00:00'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'AB+', 3, 'high', 'Scheduled cardiac surgery', '2024-07-16 08:00:00'),
((SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), 'A+', 8, 'medium', 'Replenish low inventory', '2024-07-18 12:00:00'),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'B-', 2, 'high', 'Cancer patient treatment', '2024-07-17 10:00:00'),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'O+', 6, 'medium', 'Routine inventory maintenance', '2024-07-20 16:00:00');

-- Sample donors (you'll need to create donor users first in Supabase Auth)
-- Note: Replace the user_id values with actual UUIDs from your auth.users table
INSERT INTO public.donors (user_id, blood_type, date_of_birth, weight_kg, last_donation_date, next_eligible_date, address, city, state, zip_code) VALUES
('00000000-0000-0000-0000-000000000004', 'O+', '1990-05-15', 70, '2024-05-20', '2024-07-15', '321 Elm Street', 'New York', 'NY', '10002'),
('00000000-0000-0000-0000-000000000005', 'A-', '1985-08-22', 65, '2024-04-10', '2024-06-05', '654 Maple Drive', 'Los Angeles', 'CA', '90002'),
('00000000-0000-0000-0000-000000000006', 'B+', '1992-12-03', 75, '2024-06-01', '2024-07-27', '987 Cedar Lane', 'Chicago', 'IL', '60602'),
('00000000-0000-0000-0000-000000000007', 'AB-', '1988-03-18', 68, '2024-03-15', '2024-05-10', '147 Birch Avenue', 'Houston', 'TX', '77001'),
('00000000-0000-0000-0000-000000000008', 'O-', '1995-09-07', 72, '2024-05-05', '2024-06-30', '258 Spruce Road', 'Phoenix', 'AZ', '85001');

-- Sample donations
INSERT INTO public.donations (donor_id, hospital_id, donation_date, blood_type, hemoglobin_level, blood_pressure_systolic, blood_pressure_diastolic) VALUES
((SELECT id FROM public.donors WHERE blood_type = 'O+' LIMIT 1), (SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), '2024-05-20', 'O+', 14.5, 120, 80),
((SELECT id FROM public.donors WHERE blood_type = 'A-' LIMIT 1), (SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), '2024-04-10', 'A-', 13.8, 115, 75),
((SELECT id FROM public.donors WHERE blood_type = 'B+' LIMIT 1), (SELECT id FROM public.hospitals WHERE name = 'Regional Blood Bank'), '2024-06-01', 'B+', 15.2, 125, 85),
((SELECT id FROM public.donors WHERE blood_type = 'AB-' LIMIT 1), (SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), '2024-03-15', 'AB-', 14.0, 118, 78),
((SELECT id FROM public.donors WHERE blood_type = 'O-' LIMIT 1), (SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), '2024-05-05', 'O-', 14.8, 122, 82);

-- Sample notifications
INSERT INTO public.notifications (user_id, title, message, type, is_read) VALUES
('00000000-0000-0000-0000-000000000004', 'Eligible to Donate Again!', 'You are now eligible to donate blood again. Your last donation was on May 20, 2024.', 'eligibility_reminder', false),
('00000000-0000-0000-0000-000000000005', 'Urgent Blood Need in Your Area', 'City General Hospital urgently needs A- blood type. Can you help?', 'urgent_request', false),
('00000000-0000-0000-0000-000000000006', 'Thank You for Your Donation!', 'Thank you for your blood donation on June 1, 2024. Your contribution helps save lives!', 'donation_confirmation', true),
('00000000-0000-0000-0000-000000000007', 'Upcoming Eligibility Date', 'You will be eligible to donate again on May 10, 2024. Mark your calendar!', 'eligibility_reminder', true),
('00000000-0000-0000-0000-000000000008', 'Emergency Blood Drive', 'There is an emergency blood drive happening this weekend. Your O- blood type is especially needed!', 'urgent_request', false);

-- Update some blood requests to show fulfilled status
UPDATE public.blood_requests 
SET status = 'fulfilled', units_fulfilled = units_needed 
WHERE blood_type = 'AB-' AND hospital_id = (SELECT id FROM public.hospitals WHERE name = 'City General Hospital');

-- Add some medical conditions to donors (optional)
UPDATE public.donors 
SET medical_conditions = ARRAY['Hypertension'] 
WHERE blood_type = 'A-';

UPDATE public.donors 
SET medical_conditions = ARRAY['Diabetes Type 2', 'High Cholesterol'] 
WHERE blood_type = 'B+';

-- Add emergency contacts
UPDATE public.donors 
SET emergency_contact_name = 'Jane Doe', emergency_contact_phone = '+1-555-1001'
WHERE blood_type = 'O+';

UPDATE public.donors 
SET emergency_contact_name = 'John Smith', emergency_contact_phone = '+1-555-1002'
WHERE blood_type = 'A-';

UPDATE public.donors 
SET emergency_contact_name = 'Mary Johnson', emergency_contact_phone = '+1-555-1003'
WHERE blood_type = 'B+';

-- Note: Remember to update the user_id values with actual UUIDs from your Supabase auth.users table
-- You can get these by running: SELECT id, email FROM auth.users;

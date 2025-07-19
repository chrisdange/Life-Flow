import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ocuddmoanmoeggzvbajr:tSql8RmG95uakuOj@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function setupDatabase() {
  try {
    console.log("🚀 Setting up LifeFlow database...");

    // Create enums
    console.log("📝 Creating enums...");

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE blood_type_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE user_role_enum AS ENUM ('donor', 'hospital', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE request_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE request_status_enum AS ENUM ('open', 'fulfilled', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log("✅ Enums created successfully");

    // Create users table
    console.log("👥 Creating users table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role user_role_enum NOT NULL DEFAULT 'donor',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create donors table
    console.log("🩸 Creating donors table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS donors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create hospitals table
    console.log("🏥 Creating hospitals table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS hospitals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create blood_inventory table
    console.log("📊 Creating blood_inventory table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS blood_inventory (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
        blood_type blood_type_enum NOT NULL,
        units_available INTEGER NOT NULL DEFAULT 0,
        units_reserved INTEGER NOT NULL DEFAULT 0,
        expiry_date DATE,
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(hospital_id, blood_type)
      );
    `;

    // Create blood_requests table
    console.log("📋 Creating blood_requests table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS blood_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
        blood_type blood_type_enum NOT NULL,
        units_needed INTEGER NOT NULL,
        units_fulfilled INTEGER DEFAULT 0,
        priority request_priority_enum NOT NULL DEFAULT 'medium',
        status request_status_enum NOT NULL DEFAULT 'open',
        reason TEXT,
        needed_by TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create donations table
    console.log("💝 Creating donations table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
        hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
        blood_request_id UUID REFERENCES blood_requests(id) ON DELETE SET NULL,
        donation_date DATE NOT NULL,
        units_donated INTEGER NOT NULL DEFAULT 1,
        blood_type blood_type_enum NOT NULL,
        hemoglobin_level DECIMAL(3,1),
        blood_pressure_systolic INTEGER,
        blood_pressure_diastolic INTEGER,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create notifications table
    console.log("🔔 Creating notifications table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT false,
        related_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create indexes
    console.log("🔍 Creating indexes...");
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_donors_next_eligible_date ON donors(next_eligible_date);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_blood_requests_priority ON blood_requests(priority);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_type ON blood_requests(blood_type);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_donations_hospital_id ON donations(hospital_id);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);`;

    console.log("🎉 Database setup completed successfully!");

    // Verify tables were created
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(
      "📋 Created tables:",
      tables.map((t) => t.table_name)
    );
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();

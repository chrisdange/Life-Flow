import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
// import { prisma } from './prisma.js'

// Temporary mock functions until we fix the Prisma setup
const mockPrisma = {
  user: {
    findUnique: async () => null,
    create: async (data) => ({ id: "mock-id", ...data.data }),
    update: async (data) => ({ id: "mock-id", ...data.data }),
  },
  donor: {
    create: async (data) => ({ id: "mock-id", ...data.data }),
  },
  hospital: {
    create: async (data) => ({ id: "mock-id", ...data.data }),
  },
};

// Custom hook to get user with database profile (simplified for now)
export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
      return;
    }

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // For now, create a mock profile from Clerk user data
    // This profile will always be "incomplete" to show role selection
    const mockProfile = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      fullName:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      phone: user.phoneNumbers[0]?.phoneNumber || null,
      role: null, // No role assigned yet - this will trigger role selection
      donor: null,
      hospital: null,
    };

    setProfile(mockProfile);
    setLoading(false);
  }, [user, isLoaded]);

  return { user, profile, loading, error, isLoaded };
}

// Helper function to update user profile (simplified)
export async function updateUserProfile(userId, updates) {
  console.log("Mock: Updating user profile", userId, updates);
  return { data: { id: userId, ...updates }, error: null };
}

// Helper function to create donor profile (simplified)
export async function createDonorProfile(userId, donorData) {
  console.log("Mock: Creating donor profile", userId, donorData);
  return { data: { id: "mock-donor-id", userId, ...donorData }, error: null };
}

// Helper function to create hospital profile (simplified)
export async function createHospitalProfile(userId, hospitalData) {
  console.log("Mock: Creating hospital profile", userId, hospitalData);
  return {
    data: { id: "mock-hospital-id", userId, ...hospitalData },
    error: null,
  };
}

// Role checking utilities
export function isDonor(profile) {
  return profile?.role === "DONOR" && profile?.donor;
}

export function isHospital(profile) {
  return profile?.role === "HOSPITAL" && profile?.hospital;
}

export function isAdmin(profile) {
  return profile?.role === "ADMIN";
}

// Authentication guard hook
export function useAuthGuard(requiredRole = null) {
  const { user, profile, loading, error } = useUserProfile();
  const { isSignedIn } = useAuth();

  const hasAccess = () => {
    if (!isSignedIn || !profile) return false;

    if (!requiredRole) return true; // No specific role required

    switch (requiredRole) {
      case "DONOR":
        return isDonor(profile);
      case "HOSPITAL":
        return isHospital(profile);
      case "ADMIN":
        return isAdmin(profile);
      default:
        return false;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    isSignedIn,
    hasAccess: hasAccess(),
    isDonor: isDonor(profile),
    isHospital: isHospital(profile),
    isAdmin: isAdmin(profile),
  };
}

// Profile completion checker
export function useProfileCompletion() {
  const { profile, loading } = useUserProfile();

  const getCompletionStatus = () => {
    if (!profile) return { isComplete: false, missingFields: [] };

    const missingFields = [];

    // Check basic user info
    if (!profile.fullName) missingFields.push("Full Name");
    if (!profile.phone) missingFields.push("Phone Number");

    // Check role-specific completion
    if (profile.role === "DONOR") {
      if (!profile.donor) {
        missingFields.push("Donor Profile");
      } else {
        if (!profile.donor.bloodType) missingFields.push("Blood Type");
        if (!profile.donor.dateOfBirth) missingFields.push("Date of Birth");
        if (!profile.donor.address) missingFields.push("Address");
        if (!profile.donor.city) missingFields.push("City");
        if (!profile.donor.state) missingFields.push("State");
      }
    } else if (profile.role === "HOSPITAL") {
      if (!profile.hospital) {
        missingFields.push("Hospital Profile");
      } else {
        if (!profile.hospital.name) missingFields.push("Hospital Name");
        if (!profile.hospital.licenseNumber)
          missingFields.push("License Number");
        if (!profile.hospital.address) missingFields.push("Hospital Address");
        if (!profile.hospital.phone) missingFields.push("Hospital Phone");
      }
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage: Math.round(
        ((10 - missingFields.length) / 10) * 100
      ),
    };
  };

  return {
    profile,
    loading,
    ...getCompletionStatus(),
  };
}

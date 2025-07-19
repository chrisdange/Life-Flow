import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

// Custom hook to get user with database profile (simplified for now)
export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    // For now, create a mock profile from Clerk user data
    const mockProfile = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      fullName:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      phone: user.phoneNumbers[0]?.phoneNumber || null,
      role: "HOSPITAL", // Default role for admin app
      donor: null,
      hospital: {
        id: "mock-hospital-id",
        name: "Mock Hospital",
        isVerified: true, // For testing purposes
      },
    };

    setProfile(mockProfile);
    setLoading(false);
  }, [user, isLoaded]);

  return { user, profile, loading, error, isLoaded };
}

// Helper function to update user profile
export async function updateUserProfile(userId, updates) {
  try {
    console.log("Mock: Updating user profile", userId, updates);
    const updatedUser = { id: userId, ...updates };
    return { data: updatedUser, error: null };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { data: null, error };
  }
}

// Helper function to create hospital profile
export async function createHospitalProfile(userId, hospitalData) {
  try {
    console.log("Mock: Creating hospital profile", userId, hospitalData);
    const hospital = { id: "mock-hospital-id", userId, ...hospitalData };

    return { data: hospital, error: null };
  } catch (error) {
    console.error("Error creating hospital profile:", error);
    return { data: null, error };
  }
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

// Authentication guard hook for admin app
export function useAuthGuard() {
  const { user, profile, loading, error } = useUserProfile();
  const { isSignedIn } = useAuth();

  const hasAccess = () => {
    if (!isSignedIn || !profile) return false;

    // Admin app requires hospital or admin role
    return isHospital(profile) || isAdmin(profile);
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

// Hospital profile completion checker
export function useHospitalProfileCompletion() {
  const { profile, loading } = useUserProfile();

  const getCompletionStatus = () => {
    if (!profile) return { isComplete: false, missingFields: [] };

    const missingFields = [];

    // Check basic user info
    if (!profile.fullName) missingFields.push("Full Name");
    if (!profile.phone) missingFields.push("Phone Number");

    // Check hospital-specific completion
    if (profile.role === "HOSPITAL") {
      if (!profile.hospital) {
        missingFields.push("Hospital Profile");
      } else {
        if (!profile.hospital.name) missingFields.push("Hospital Name");
        if (!profile.hospital.licenseNumber)
          missingFields.push("License Number");
        if (!profile.hospital.address) missingFields.push("Hospital Address");
        if (!profile.hospital.city) missingFields.push("City");
        if (!profile.hospital.state) missingFields.push("State");
        if (!profile.hospital.zipCode) missingFields.push("ZIP Code");
        if (!profile.hospital.phone) missingFields.push("Hospital Phone");
      }
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage: Math.round(((8 - missingFields.length) / 8) * 100),
    };
  };

  return {
    profile,
    loading,
    ...getCompletionStatus(),
  };
}

// Hospital verification status
export function useHospitalVerification() {
  const { profile, loading } = useUserProfile();

  return {
    profile,
    loading,
    isVerified: profile?.hospital?.isVerified || false,
    verificationStatus: profile?.hospital?.isVerified ? "verified" : "pending",
  };
}

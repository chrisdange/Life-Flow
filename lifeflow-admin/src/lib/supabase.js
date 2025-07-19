import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication
export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },
};

// Helper functions for database operations
export const database = {
  // Donors
  createDonor: async (donorData) => {
    const { data, error } = await supabase
      .from("donors")
      .insert([donorData])
      .select();
    return { data, error };
  },

  getDonor: async (userId) => {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  },

  // Donations
  createDonation: async (donationData) => {
    const { data, error } = await supabase
      .from("donations")
      .insert([donationData])
      .select();
    return { data, error };
  },

  getDonationHistory: async (donorId) => {
    const { data, error } = await supabase
      .from("donations")
      .select(
        `
        *,
        hospitals (name, address)
      `
      )
      .eq("donor_id", donorId)
      .order("donation_date", { ascending: false });
    return { data, error };
  },

  // Hospitals
  getHospitals: async () => {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("name");
    return { data, error };
  },

  // Blood requests
  getUrgentRequests: async () => {
    const { data, error } = await supabase
      .from("blood_requests")
      .select(
        `
        *,
        hospitals (name, address, phone)
      `
      )
      .eq("status", "urgent")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Blood inventory
  getBloodInventory: async () => {
    const { data, error } = await supabase
      .from("blood_inventory")
      .select("*")
      .order("blood_type");
    return { data, error };
  },
};

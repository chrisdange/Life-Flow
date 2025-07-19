import { supabase } from './supabase.js';

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Create or update user profile
 */
export async function upsertUser(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting user:', error);
    return { data: null, error };
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
}

// ============================================================================
// DONOR OPERATIONS
// ============================================================================

/**
 * Create or update donor profile
 */
export async function upsertDonor(donorData) {
  try {
    const { data, error } = await supabase
      .from('donors')
      .upsert(donorData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting donor:', error);
    return { data: null, error };
  }
}

/**
 * Get donor profile by user ID
 */
export async function getDonorProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        users (
          full_name,
          email,
          phone
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    return { data: null, error };
  }
}

/**
 * Get eligible donors by blood type
 */
export async function getEligibleDonors(bloodType) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        users (
          full_name,
          email,
          phone
        )
      `)
      .eq('blood_type', bloodType)
      .eq('is_active', true)
      .lte('next_eligible_date', today);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching eligible donors:', error);
    return { data: null, error };
  }
}

// ============================================================================
// HOSPITAL OPERATIONS
// ============================================================================

/**
 * Get all verified hospitals
 */
export async function getVerifiedHospitals() {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('is_verified', true)
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return { data: null, error };
  }
}

/**
 * Get hospital profile by user ID
 */
export async function getHospitalProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching hospital profile:', error);
    return { data: null, error };
  }
}

// ============================================================================
// BLOOD INVENTORY OPERATIONS
// ============================================================================

/**
 * Get blood inventory for all hospitals or specific hospital
 */
export async function getBloodInventory(hospitalId = null) {
  try {
    let query = supabase
      .from('blood_inventory')
      .select(`
        *,
        hospitals (
          name,
          city,
          state
        )
      `)
      .order('blood_type');

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching blood inventory:', error);
    return { data: null, error };
  }
}

/**
 * Update blood inventory
 */
export async function updateBloodInventory(hospitalId, bloodType, updates) {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('hospital_id', hospitalId)
      .eq('blood_type', bloodType)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating blood inventory:', error);
    return { data: null, error };
  }
}

// ============================================================================
// BLOOD REQUESTS OPERATIONS
// ============================================================================

/**
 * Get active blood requests
 */
export async function getActiveBloodRequests() {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select(`
        *,
        hospitals (
          name,
          city,
          state,
          phone
        )
      `)
      .eq('status', 'open')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    return { data: null, error };
  }
}

/**
 * Create new blood request
 */
export async function createBloodRequest(requestData) {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating blood request:', error);
    return { data: null, error };
  }
}

// ============================================================================
// DONATIONS OPERATIONS
// ============================================================================

/**
 * Get donation history for a donor
 */
export async function getDonationHistory(donorId) {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        hospitals (
          name,
          city,
          state
        )
      `)
      .eq('donor_id', donorId)
      .order('donation_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching donation history:', error);
    return { data: null, error };
  }
}

/**
 * Record new donation
 */
export async function recordDonation(donationData) {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert(donationData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error recording donation:', error);
    return { data: null, error };
  }
}

// ============================================================================
// NOTIFICATIONS OPERATIONS
// ============================================================================

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId, unreadOnly = false) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: null, error };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { data: null, error };
  }
}

import { supabase } from './supabase.js';

// ============================================================================
// HOSPITAL ADMIN OPERATIONS
// ============================================================================

/**
 * Create or update hospital profile
 */
export async function upsertHospital(hospitalData) {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .upsert(hospitalData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting hospital:', error);
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
// BLOOD INVENTORY MANAGEMENT
// ============================================================================

/**
 * Get blood inventory for hospital
 */
export async function getHospitalBloodInventory(hospitalId) {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('blood_type');

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
      .upsert({
        hospital_id: hospitalId,
        blood_type: bloodType,
        ...updates,
        last_updated: new Date().toISOString()
      }, { onConflict: 'hospital_id,blood_type' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating blood inventory:', error);
    return { data: null, error };
  }
}

/**
 * Initialize blood inventory for all blood types
 */
export async function initializeBloodInventory(hospitalId) {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  try {
    const inventoryData = bloodTypes.map(bloodType => ({
      hospital_id: hospitalId,
      blood_type: bloodType,
      units_available: 0,
      units_reserved: 0,
      last_updated: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('blood_inventory')
      .upsert(inventoryData, { onConflict: 'hospital_id,blood_type' })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing blood inventory:', error);
    return { data: null, error };
  }
}

// ============================================================================
// BLOOD REQUESTS MANAGEMENT
// ============================================================================

/**
 * Get blood requests for hospital
 */
export async function getHospitalBloodRequests(hospitalId, status = null) {
  try {
    let query = supabase
      .from('blood_requests')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

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

/**
 * Update blood request
 */
export async function updateBloodRequest(requestId, updates) {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating blood request:', error);
    return { data: null, error };
  }
}

// ============================================================================
// DONATIONS MANAGEMENT
// ============================================================================

/**
 * Get donations received by hospital
 */
export async function getHospitalDonations(hospitalId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donors (
          blood_type,
          users (
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('hospital_id', hospitalId)
      .order('donation_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching hospital donations:', error);
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
// DONOR SEARCH AND MANAGEMENT
// ============================================================================

/**
 * Search for eligible donors by blood type
 */
export async function searchEligibleDonors(bloodType, location = null) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
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

    if (location) {
      query = query.ilike('city', `%${location}%`);
    }

    const { data, error } = await query.order('next_eligible_date');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching eligible donors:', error);
    return { data: null, error };
  }
}

// ============================================================================
// STATISTICS AND ANALYTICS
// ============================================================================

/**
 * Get hospital statistics
 */
export async function getHospitalStats(hospitalId) {
  try {
    // Get total inventory
    const { data: inventory } = await supabase
      .from('blood_inventory')
      .select('units_available, units_reserved')
      .eq('hospital_id', hospitalId);

    // Get active requests
    const { data: activeRequests } = await supabase
      .from('blood_requests')
      .select('id')
      .eq('hospital_id', hospitalId)
      .eq('status', 'open');

    // Get recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentDonations } = await supabase
      .from('donations')
      .select('units_donated')
      .eq('hospital_id', hospitalId)
      .gte('donation_date', thirtyDaysAgo.toISOString().split('T')[0]);

    // Calculate totals
    const totalUnitsAvailable = inventory?.reduce((sum, item) => sum + item.units_available, 0) || 0;
    const totalUnitsReserved = inventory?.reduce((sum, item) => sum + item.units_reserved, 0) || 0;
    const totalActiveRequests = activeRequests?.length || 0;
    const totalRecentDonations = recentDonations?.reduce((sum, item) => sum + item.units_donated, 0) || 0;

    return {
      data: {
        totalUnitsAvailable,
        totalUnitsReserved,
        totalActiveRequests,
        totalRecentDonations,
        inventoryByType: inventory || []
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    return { data: null, error };
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Create notification for users
 */
export async function createNotification(notificationData) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { data: null, error };
  }
}

/**
 * Send urgent blood request notifications to eligible donors
 */
export async function notifyEligibleDonors(bloodType, hospitalId, message) {
  try {
    // Get eligible donors
    const { data: donors } = await searchEligibleDonors(bloodType);
    
    if (!donors || donors.length === 0) {
      return { data: { notified: 0 }, error: null };
    }

    // Create notifications for all eligible donors
    const notifications = donors.map(donor => ({
      user_id: donor.user_id,
      title: `Urgent: ${bloodType} Blood Needed`,
      message,
      type: 'urgent_request',
      related_id: hospitalId
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;
    return { data: { notified: data.length }, error: null };
  } catch (error) {
    console.error('Error notifying eligible donors:', error);
    return { data: null, error };
  }
}

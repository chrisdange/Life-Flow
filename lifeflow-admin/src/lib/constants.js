// ============================================================================
// DATABASE CONSTANTS
// ============================================================================

export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const USER_ROLES = {
  DONOR: 'donor',
  HOSPITAL: 'hospital',
  ADMIN: 'admin'
};

export const REQUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const REQUEST_STATUSES = {
  OPEN: 'open',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled'
};

export const NOTIFICATION_TYPES = {
  URGENT_REQUEST: 'urgent_request',
  ELIGIBILITY_REMINDER: 'eligibility_reminder',
  DONATION_CONFIRMATION: 'donation_confirmation',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  INVENTORY_LOW: 'inventory_low'
};

// ============================================================================
// BLOOD TYPE COMPATIBILITY
// ============================================================================

export const BLOOD_COMPATIBILITY = {
  // Who can receive from whom
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal donor (can only receive O-)
};

// Who can donate to whom
export const BLOOD_DONATION_COMPATIBILITY = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['A+', 'B+', 'AB+', 'O+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal donor
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION_RULES = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT_KG: 50,
  MIN_HEMOGLOBIN_MALE: 13.0,
  MIN_HEMOGLOBIN_FEMALE: 12.5,
  DONATION_INTERVAL_DAYS: 56, // 8 weeks between donations
  MAX_DONATIONS_PER_YEAR: 6
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const PRIORITY_COLORS = {
  [REQUEST_PRIORITIES.LOW]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500'
  },
  [REQUEST_PRIORITIES.MEDIUM]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500'
  },
  [REQUEST_PRIORITIES.HIGH]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-500'
  },
  [REQUEST_PRIORITIES.URGENT]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500'
  }
};

export const STATUS_COLORS = {
  [REQUEST_STATUSES.OPEN]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  },
  [REQUEST_STATUSES.FULFILLED]: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  [REQUEST_STATUSES.CANCELLED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  }
};

export const BLOOD_TYPE_COLORS = {
  'A+': 'bg-red-500',
  'A-': 'bg-red-600',
  'B+': 'bg-blue-500',
  'B-': 'bg-blue-600',
  'AB+': 'bg-purple-500',
  'AB-': 'bg-purple-600',
  'O+': 'bg-green-500',
  'O-': 'bg-green-600'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a donor can donate to a recipient
 */
export function canDonateToRecipient(donorBloodType, recipientBloodType) {
  return BLOOD_DONATION_COMPATIBILITY[donorBloodType]?.includes(recipientBloodType) || false;
}

/**
 * Check if a recipient can receive from a donor
 */
export function canReceiveFromDonor(recipientBloodType, donorBloodType) {
  return BLOOD_COMPATIBILITY[recipientBloodType]?.includes(donorBloodType) || false;
}

/**
 * Get compatible donors for a blood type
 */
export function getCompatibleDonors(recipientBloodType) {
  return BLOOD_COMPATIBILITY[recipientBloodType] || [];
}

/**
 * Get compatible recipients for a donor blood type
 */
export function getCompatibleRecipients(donorBloodType) {
  return BLOOD_DONATION_COMPATIBILITY[donorBloodType] || [];
}

/**
 * Calculate next eligible donation date
 */
export function calculateNextEligibleDate(lastDonationDate) {
  if (!lastDonationDate) return new Date();
  
  const lastDate = new Date(lastDonationDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + VALIDATION_RULES.DONATION_INTERVAL_DAYS);
  
  return nextDate;
}

/**
 * Check if donor is eligible to donate
 */
export function isDonorEligible(donor) {
  const today = new Date();
  const nextEligibleDate = new Date(donor.next_eligible_date);
  
  return today >= nextEligibleDate && donor.is_active;
}

/**
 * Format blood type for display
 */
export function formatBloodType(bloodType) {
  return bloodType || 'Unknown';
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate donor eligibility based on age and weight
 */
export function validateDonorEligibility(dateOfBirth, weightKg) {
  const age = calculateAge(dateOfBirth);
  
  return {
    isEligible: age >= VALIDATION_RULES.MIN_AGE && 
                age <= VALIDATION_RULES.MAX_AGE && 
                weightKg >= VALIDATION_RULES.MIN_WEIGHT_KG,
    reasons: [
      ...(age < VALIDATION_RULES.MIN_AGE ? [`Must be at least ${VALIDATION_RULES.MIN_AGE} years old`] : []),
      ...(age > VALIDATION_RULES.MAX_AGE ? [`Must be under ${VALIDATION_RULES.MAX_AGE} years old`] : []),
      ...(weightKg < VALIDATION_RULES.MIN_WEIGHT_KG ? [`Must weigh at least ${VALIDATION_RULES.MIN_WEIGHT_KG}kg`] : [])
    ]
  };
}

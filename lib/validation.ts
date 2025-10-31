/**
 * Form Validation Utilities
 * Comprehensive validation functions with user-friendly error messages
 */

import { ValidationError } from './errors';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

// Name validation
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must not exceed 50 characters` };
  }

  return { isValid: true };
}

// NTRP rating validation
export function validateNtrpRating(rating: number): ValidationResult {
  if (rating < 1.0 || rating > 7.0) {
    return { isValid: false, error: 'NTRP rating must be between 1.0 and 7.0' };
  }

  // Must be in 0.5 increments
  if ((rating * 10) % 5 !== 0) {
    return { isValid: false, error: 'NTRP rating must be in 0.5 increments (e.g., 3.5, 4.0)' };
  }

  return { isValid: true };
}

// Phone number validation
export function validatePhoneNumber(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove formatting characters
  const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if it contains only digits and optional + at the start
  if (!/^\+?\d{10,15}$/.test(cleanedPhone)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number (10-15 digits)'
    };
  }

  return { isValid: true };
}

// Location validation
export function validateLocation(location: string): ValidationResult {
  if (!location || location.trim().length === 0) {
    return { isValid: false, error: 'Location is required' };
  }

  if (location.trim().length < 3) {
    return { isValid: false, error: 'Location must be at least 3 characters' };
  }

  return { isValid: true };
}

// Bio validation
export function validateBio(bio: string): ValidationResult {
  if (bio && bio.length > 500) {
    return { isValid: false, error: 'Bio must not exceed 500 characters' };
  }

  return { isValid: true };
}

// Playing style validation
export function validatePlayingStyle(style: string): ValidationResult {
  const validStyles = ['aggressive', 'defensive', 'all-court', 'serve-and-volley'];

  if (!style || !validStyles.includes(style.toLowerCase())) {
    return {
      isValid: false,
      error: 'Please select a valid playing style'
    };
  }

  return { isValid: true };
}

// Match duration validation
export function validateMatchDuration(duration: number): ValidationResult {
  if (duration < 30 || duration > 300) {
    return {
      isValid: false,
      error: 'Match duration must be between 30 and 300 minutes'
    };
  }

  return { isValid: true };
}

// Date validation
export function validateDate(date: Date | string | null | undefined): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  return { isValid: true };
}

// Future date validation
export function validateFutureDate(date: Date | string): ValidationResult {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time for date-only comparison

  if (dateObj < now) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true };
}

// Time validation (HH:MM format)
export function validateTime(time: string): ValidationResult {
  if (!time) {
    return { isValid: false, error: 'Time is required' };
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    return { isValid: false, error: 'Please enter a valid time (HH:MM format)' };
  }

  return { isValid: true };
}

// Court name validation
export function validateCourtName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Court name is required' };
  }

  if (name.trim().length < 3) {
    return { isValid: false, error: 'Court name must be at least 3 characters' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Court name must not exceed 100 characters' };
  }

  return { isValid: true };
}

// Surface type validation
export function validateSurfaceType(surface: string): ValidationResult {
  const validSurfaces = ['hard', 'clay', 'grass', 'carpet'];

  if (!surface || !validSurfaces.includes(surface.toLowerCase())) {
    return {
      isValid: false,
      error: 'Please select a valid surface type'
    };
  }

  return { isValid: true };
}

// URL validation
export function validateUrl(url: string, fieldName: string = 'URL'): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { isValid: true }; // Optional field
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: `Please enter a valid ${fieldName}` };
  }
}

// Number range validation
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }

  return { isValid: true };
}

// Required field validation
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

// Multiple validation
export function validateMultiple(
  validations: ValidationResult[]
): ValidationResult {
  const failedValidation = validations.find(v => !v.isValid);

  if (failedValidation) {
    return failedValidation;
  }

  return { isValid: true };
}

// Profile form validation
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  ntrpRating: number;
  playingStyle?: string;
  bio?: string;
}

export function validateProfileForm(data: ProfileFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const firstNameValidation = validateName(data.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error!;
  }

  const lastNameValidation = validateName(data.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error!;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  if (data.phone) {
    const phoneValidation = validatePhoneNumber(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }
  }

  const locationValidation = validateLocation(data.location);
  if (!locationValidation.isValid) {
    errors.location = locationValidation.error!;
  }

  const ratingValidation = validateNtrpRating(data.ntrpRating);
  if (!ratingValidation.isValid) {
    errors.ntrpRating = ratingValidation.error!;
  }

  if (data.playingStyle) {
    const styleValidation = validatePlayingStyle(data.playingStyle);
    if (!styleValidation.isValid) {
      errors.playingStyle = styleValidation.error!;
    }
  }

  if (data.bio) {
    const bioValidation = validateBio(data.bio);
    if (!bioValidation.isValid) {
      errors.bio = bioValidation.error!;
    }
  }

  return errors;
}

// Match form validation
export interface MatchFormData {
  date: Date | string;
  time: string;
  duration: number;
  location: string;
}

export function validateMatchForm(data: MatchFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const dateValidation = validateFutureDate(data.date);
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error!;
  }

  const timeValidation = validateTime(data.time);
  if (!timeValidation.isValid) {
    errors.time = timeValidation.error!;
  }

  const durationValidation = validateMatchDuration(data.duration);
  if (!durationValidation.isValid) {
    errors.duration = durationValidation.error!;
  }

  const locationValidation = validateLocation(data.location);
  if (!locationValidation.isValid) {
    errors.location = locationValidation.error!;
  }

  return errors;
}

// Court form validation
export interface CourtFormData {
  name: string;
  location: string;
  surfaceType: string;
  website?: string;
}

export function validateCourtForm(data: CourtFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameValidation = validateCourtName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  const locationValidation = validateLocation(data.location);
  if (!locationValidation.isValid) {
    errors.location = locationValidation.error!;
  }

  const surfaceValidation = validateSurfaceType(data.surfaceType);
  if (!surfaceValidation.isValid) {
    errors.surfaceType = surfaceValidation.error!;
  }

  if (data.website) {
    const urlValidation = validateUrl(data.website, 'Website URL');
    if (!urlValidation.isValid) {
      errors.website = urlValidation.error!;
    }
  }

  return errors;
}

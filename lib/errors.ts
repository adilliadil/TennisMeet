/**
 * Error Handling System
 * Comprehensive error types, handlers, and utilities for TennisMeet
 */

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  statusCode?: number;
  field?: string; // For form validation errors
  originalError?: Error;
}

// Custom Error Classes
export class ValidationError extends Error {
  type = ErrorType.VALIDATION;
  field?: string;
  details?: string;

  constructor(message: string, field?: string, details?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.details = details;
  }
}

export class NetworkError extends Error {
  type = ErrorType.NETWORK;
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends Error {
  type = ErrorType.AUTHENTICATION;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  type = ErrorType.AUTHORIZATION;

  constructor(message: string = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  type = ErrorType.NOT_FOUND;
  resource?: string;

  constructor(resource?: string) {
    super(`${resource || 'Resource'} not found`);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

// Error Parser - Convert various error types to AppError
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error as AppError;
  }

  // Custom error classes
  if (error instanceof ValidationError) {
    return {
      type: ErrorType.VALIDATION,
      message: error.message,
      field: error.field,
      details: error.details,
    };
  }

  if (error instanceof NetworkError) {
    return {
      type: ErrorType.NETWORK,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      type: ErrorType.AUTHENTICATION,
      message: error.message,
      statusCode: 401,
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      type: ErrorType.AUTHORIZATION,
      message: error.message,
      statusCode: 403,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      type: ErrorType.NOT_FOUND,
      message: error.message,
      statusCode: 404,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    // Network/Fetch errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network error occurred. Please check your connection.',
        details: error.message,
        originalError: error,
      };
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return {
        type: ErrorType.TIMEOUT,
        message: 'Request timed out. Please try again.',
        details: error.message,
        originalError: error,
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      originalError: error,
    };
  }

  // HTTP Response errors
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const httpError = error as { status: number; statusText?: string; message?: string };

    if (httpError.status === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Please log in to continue',
        statusCode: 401,
      };
    }

    if (httpError.status === 403) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'You do not have permission to perform this action',
        statusCode: 403,
      };
    }

    if (httpError.status === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'Resource not found',
        statusCode: 404,
      };
    }

    if (httpError.status === 429) {
      return {
        type: ErrorType.RATE_LIMIT,
        message: 'Too many requests. Please try again later.',
        statusCode: 429,
      };
    }

    if (httpError.status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'Server error occurred. Please try again later.',
        statusCode: httpError.status,
      };
    }

    return {
      type: ErrorType.NETWORK,
      message: httpError.message || httpError.statusText || 'Request failed',
      statusCode: httpError.status,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
    };
  }

  // Unknown error type
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    details: JSON.stringify(error),
  };
}

// Type guard
function isAppError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error
  );
}

// User-friendly error messages
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.VALIDATION:
      return error.message;
    case ErrorType.NETWORK:
      return 'Unable to connect. Please check your internet connection and try again.';
    case ErrorType.AUTHENTICATION:
      return 'Please log in to continue.';
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
    case ErrorType.NOT_FOUND:
      return error.message || 'The requested item could not be found.';
    case ErrorType.SERVER:
      return 'Something went wrong on our end. Please try again later.';
    case ErrorType.TIMEOUT:
      return 'Request timed out. Please try again.';
    case ErrorType.RATE_LIMIT:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Error logging utility
export function logError(error: unknown, context?: string): void {
  const appError = parseError(error);

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, {
      type: appError.type,
      message: appError.message,
      details: appError.details,
      statusCode: appError.statusCode,
      field: appError.field,
      originalError: appError.originalError,
    });
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    console.error(`[${context || 'Error'}] ${appError.type}: ${appError.message}`);
  }
}

// Retry utility for network requests
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const appError = parseError(error);

      // Don't retry for certain error types
      if (
        appError.type === ErrorType.VALIDATION ||
        appError.type === ErrorType.AUTHENTICATION ||
        appError.type === ErrorType.AUTHORIZATION ||
        appError.type === ErrorType.NOT_FOUND
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

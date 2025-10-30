export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "DATABASE_ERROR", 500, details);
    this.name = "DatabaseError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "STORAGE_ERROR", 500, details);
    this.name = "StorageError";
  }
}

/**
 * Handle and format errors for API responses
 */
export function handleError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "INTERNAL_ERROR",
      statusCode: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}

/**
 * Log errors with context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const errorInfo = handleError(error);

  console.error("[Error]", {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
  });
}

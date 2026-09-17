/**
 * Error handling utilities.
 * We currently don't have a centralized error boundary —
 * these helpers are used ad-hoc in components.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function handleUnknownError(error: unknown): string {
  if (isAppError(error)) {
    return `[${error.code}] ${error.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

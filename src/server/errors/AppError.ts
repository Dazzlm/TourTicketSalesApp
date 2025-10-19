
export class AppError extends Error {
  public status: number;
  public code?: string;
  public isOperational: boolean;

  constructor(
    message: string,
    status = 400,
    code?: string,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.isOperational = isOperational;

    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
        code: this.code,
      },
    };
  }
}

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: issues.map((e: any) => ({
            field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled API Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
};

// In-Memory Rate Limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export const rateLimiter = (maxRequests: number = 60, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'client-ip';
    const key = `${ip}-${req.baseUrl}`;
    const now = Date.now();

    const record = requestCounts.get(key as string);
    if (!record || now > record.resetAt) {
      requestCounts.set(key as string, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again shortly.',
      });
      return;
    }

    record.count += 1;
    next();
  };
};

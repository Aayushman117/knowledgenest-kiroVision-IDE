import { Request, Response, NextFunction } from 'express';
import { cache } from '../utils/cache';

/**
 * Cache middleware for GET requests
 */
export function cacheMiddleware(ttl: number = 5 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `http:${req.originalUrl}`;

    // Try to get cached response
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      // Add cache hit header
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedData);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data: any) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        cache.set(cacheKey, data, ttl);
      }

      // Add cache miss header
      res.setHeader('X-Cache', 'MISS');

      return originalJson(data);
    };

    next();
  };
}

/**
 * Cache control headers middleware
 */
export function cacheControl(maxAge: number = 300) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
}

/**
 * No cache middleware for sensitive routes
 */
export function noCache(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

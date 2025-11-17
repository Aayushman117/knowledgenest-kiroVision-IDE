/**
 * Simple in-memory cache for frequently accessed data
 * In production, consider using Redis for distributed caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache data
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete cached data
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete cache entries matching pattern
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Clean expired entries every 10 minutes
setInterval(() => {
  cache.cleanExpired();
}, 10 * 60 * 1000);

/**
 * Cache key generators
 */
export const cacheKeys = {
  courses: {
    list: (filters?: Record<string, any>) => `courses:list:${JSON.stringify(filters || {})}`,
    detail: (id: string) => `courses:detail:${id}`,
    instructor: (instructorId: string) => `courses:instructor:${instructorId}`,
  },
  lessons: {
    course: (courseId: string) => `lessons:course:${courseId}`,
    detail: (id: string) => `lessons:detail:${id}`,
  },
  reviews: {
    course: (courseId: string) => `reviews:course:${courseId}`,
  },
  stats: {
    course: (courseId: string) => `stats:course:${courseId}`,
    instructor: (instructorId: string) => `stats:instructor:${instructorId}`,
  },
};

/**
 * Cache invalidation helpers
 */
export const invalidateCache = {
  courses: () => cache.deletePattern('^courses:'),
  courseDetail: (id: string) => {
    cache.delete(cacheKeys.courses.detail(id));
    cache.deletePattern('^courses:list:');
  },
  lessons: (courseId?: string) => {
    if (courseId) {
      cache.delete(cacheKeys.lessons.course(courseId));
    } else {
      cache.deletePattern('^lessons:');
    }
  },
  reviews: (courseId?: string) => {
    if (courseId) {
      cache.delete(cacheKeys.reviews.course(courseId));
      cache.delete(cacheKeys.courses.detail(courseId));
    } else {
      cache.deletePattern('^reviews:');
    }
  },
};

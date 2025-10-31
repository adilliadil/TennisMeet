/**
 * Performance Optimization Utilities
 * Debouncing, throttling, memoization, and other performance helpers
 */

// Debounce function - delays execution until after delay has passed since last call
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function - limits execution to once per delay period
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Simple memoization for functions with single primitive argument
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Memoization with TTL (time-to-live)
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  func: T,
  ttl: number = 5000
): T {
  const cache = new Map<string, { value: ReturnType<T>; expiry: number }>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const result = func(...args);
    cache.set(key, { value: result, expiry: now + ttl });

    // Clean up expired entries
    for (const [k, v] of cache.entries()) {
      if (v.expiry <= now) {
        cache.delete(k);
      }
    }

    return result;
  }) as T;
}

// Lazy load images
export function lazyLoadImage(
  src: string,
  placeholder?: string
): {
  currentSrc: string;
  loading: boolean;
  error: boolean;
} {
  const state = {
    currentSrc: placeholder || '',
    loading: true,
    error: false,
  };

  const img = new Image();

  img.onload = () => {
    state.currentSrc = src;
    state.loading = false;
  };

  img.onerror = () => {
    state.loading = false;
    state.error = true;
  };

  img.src = src;

  return state;
}

// Batch function calls
export function batchify<T>(
  func: (items: T[]) => void,
  delay: number = 50
): (item: T) => void {
  let batch: T[] = [];
  let timeoutId: NodeJS.Timeout;

  return (item: T) => {
    batch.push(item);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(batch);
      batch = [];
    }, delay);
  };
}

// Virtual scrolling helper - calculate visible items
export function calculateVisibleItems(
  totalItems: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan: number = 3
): {
  startIndex: number;
  endIndex: number;
  offsetY: number;
} {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(
    totalItems - 1,
    startIndex + visibleCount + overscan * 2
  );
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, offsetY };
}

// Request animation frame throttle
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

// Idle callback helper
export function runWhenIdle(callback: () => void, timeout: number = 2000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

// Web worker helper for heavy computations
export function createWorker(workerFunction: Function): Worker {
  const blob = new Blob([`(${workerFunction.toString()})()`], {
    type: 'application/javascript',
  });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Optimize search/filter operations
export function optimizedFilter<T>(
  items: T[],
  predicate: (item: T) => boolean,
  batchSize: number = 1000
): T[] {
  if (items.length <= batchSize) {
    return items.filter(predicate);
  }

  const result: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    result.push(...batch.filter(predicate));
  }

  return result;
}

// Optimize search with early termination
export function optimizedSearch<T>(
  items: T[],
  predicate: (item: T) => boolean,
  maxResults: number = 50
): T[] {
  const result: T[] = [];

  for (const item of items) {
    if (predicate(item)) {
      result.push(item);
      if (result.length >= maxResults) {
        break;
      }
    }
  }

  return result;
}

// Chunked processing for large datasets
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize: number = 100,
  onProgress?: (progress: number) => void
): Promise<R[]> {
  const results: R[] = [];
  const totalChunks = Math.ceil(items.length / chunkSize);

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = chunk.map(processor);
    results.push(...chunkResults);

    // Allow UI to update between chunks
    await new Promise(resolve => setTimeout(resolve, 0));

    if (onProgress) {
      const currentChunk = Math.floor(i / chunkSize) + 1;
      onProgress((currentChunk / totalChunks) * 100);
    }
  }

  return results;
}

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string, log: boolean = true): number {
    const startTime = this.marks.get(label);

    if (!startTime) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (log && process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Cache with LRU (Least Recently Used) eviction
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);

    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }

    return value;
  }

  set(key: K, value: V): void {
    // Remove if already exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

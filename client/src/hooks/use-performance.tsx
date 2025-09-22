// تحسين إدارة الذاكرة والأداء
import { useEffect, useRef, useCallback, useMemo } from 'react';

// Hook لتحسين الأداء
export function usePerformanceOptimization() {
  const performanceRef = useRef({
    startTime: 0,
    endTime: 0,
    memoryUsage: 0,
  });

  // مراقبة استخدام الذاكرة
  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      performanceRef.current.memoryUsage = memory.usedJSHeapSize;

      // تحذير إذا تجاوز استخدام الذاكرة الحد المسموح
      if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
        // 100MB
        console.warn('High memory usage detected:', memory.usedJSHeapSize);
      }
    }
  }, []);

  // تنظيف الذاكرة
  const cleanupMemory = useCallback(() => {
    if (window.gc) {
      window.gc();
    }

    // تنظيف المتغيرات المؤقتة
    if (performanceRef.current) {
      performanceRef.current = {
        startTime: 0,
        endTime: 0,
        memoryUsage: 0,
      };
    }
  }, []);

  // مراقبة الأداء
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    performanceRef.current.startTime = performance.now();
    fn();
    performanceRef.current.endTime = performance.now();

    const duration =
      performanceRef.current.endTime - performanceRef.current.startTime;
    console.log(`${name} took ${duration.toFixed(2)}ms`);

    return duration;
  }, []);

  useEffect(() => {
    // مراقبة استخدام الذاكرة كل 30 ثانية
    const interval = setInterval(trackMemoryUsage, 30000);

    return () => {
      clearInterval(interval);
      cleanupMemory();
    };
  }, [trackMemoryUsage, cleanupMemory]);

  return {
    trackMemoryUsage,
    cleanupMemory,
    measurePerformance,
    memoryUsage: performanceRef.current.memoryUsage,
  };
}

// Hook لتحسين التحميل البطيء
export function useLazyLoading<T>(data: T[], pageSize: number = 20) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // محاكاة التحميل البطيء
    setTimeout(() => {
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const newItems = data.slice(startIndex, endIndex);

      setVisibleItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 100);
  }, [data, currentPage, pageSize, isLoading]);

  const hasMoreItems = useMemo(() => {
    return (currentPage + 1) * pageSize < data.length;
  }, [currentPage, pageSize, data.length]);

  useEffect(() => {
    if (data.length > 0 && visibleItems.length === 0) {
      loadMoreItems();
    }
  }, [data, visibleItems.length, loadMoreItems]);

  return {
    visibleItems,
    loadMoreItems,
    hasMoreItems,
    isLoading,
  };
}

// Hook لتحسين التخزين المؤقت
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(
    new Map()
  );

  const getCachedData = useCallback(() => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }, [key, ttl]);

  const setCachedData = useCallback(
    (newData: T) => {
      cacheRef.current.set(key, {
        data: newData,
        timestamp: Date.now(),
      });
    },
    [key]
  );

  const fetchData = useCallback(async () => {
    // تحقق من التخزين المؤقت أولاً
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      return cachedData;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  const clearCache = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    clearCache,
  };
}

// Hook لتحسين التحديثات
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook لتحسين التحميل المتوازي
export function useParallelLoading<T>(loaders: (() => Promise<T>)[]) {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      const promises = loaders.map(loader => loader());
      const results = await Promise.allSettled(promises);

      const successfulResults: T[] = [];
      const failedErrors: Error[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulResults.push(result.value);
        } else {
          failedErrors.push(
            new Error(`Loader ${index} failed: ${result.reason}`)
          );
        }
      });

      setResults(successfulResults);
      setErrors(failedErrors);
    } catch (error) {
      setErrors([error instanceof Error ? error : new Error('Unknown error')]);
    } finally {
      setIsLoading(false);
    }
  }, [loaders]);

  useEffect(() => {
    if (loaders.length > 0) {
      loadAll();
    }
  }, [loadAll]);

  return {
    results,
    isLoading,
    errors,
    reload: loadAll,
  };
}

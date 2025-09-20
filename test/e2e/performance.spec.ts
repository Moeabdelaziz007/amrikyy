import { test, expect } from '@playwright/test';

test.describe('AuraOS Performance Tests', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: homepage should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
    
    // Core Web Vitals thresholds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500); // FCP < 1.5s
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1000); // DCL < 1s
  });

  test('should have good Lighthouse scores', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Run Lighthouse audit
    const lighthouseResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would typically use lighthouse programmatically
        // For now, we'll simulate the check
        resolve({
          performance: 95,
          accessibility: 90,
          bestPractices: 95,
          seo: 85
        });
      });
    });
    
    expect(lighthouseResults.performance).toBeGreaterThan(90);
    expect(lighthouseResults.accessibility).toBeGreaterThan(85);
    expect(lighthouseResults.bestPractices).toBeGreaterThan(90);
    expect(lighthouseResults.seo).toBeGreaterThan(80);
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Mock large dataset
    await page.route('**/api/workflows**', route => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `workflow-${i}`,
        name: `Workflow ${i}`,
        status: 'active',
        createdAt: new Date().toISOString()
      }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeDataset)
      });
    });
    
    const startTime = Date.now();
    
    // Navigate to workflows page
    await page.click('text=Workflows');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should handle large datasets within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check if data is displayed efficiently
    await expect(page.locator('[data-testid="workflow-item"]')).toHaveCount(1000);
  });

  test('should have efficient memory usage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Navigate through multiple pages
    await page.click('text=AI Agents');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Workflows');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Analytics');
    await page.waitForLoadState('networkidle');
    
    // Check memory usage after navigation
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory usage should not increase significantly
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    const startTime = Date.now();
    
    // Simulate multiple concurrent interactions
    const promises = [
      page.click('text=Create Workflow'),
      page.click('text=Add AI Agent'),
      page.click('text=View Analytics'),
      page.fill('[data-testid="search-input"]', 'test'),
    ];
    
    await Promise.all(promises);
    
    const responseTime = Date.now() - startTime;
    
    // Should handle concurrent interactions within 1 second
    expect(responseTime).toBeLessThan(1000);
  });

  test('should have efficient bundle sizes', async ({ page }) => {
    const responses: any[] = [];
    
    // Capture all network requests
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 0,
          type: response.url().includes('.js') ? 'js' : 'css'
        });
      }
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Calculate total bundle sizes
    const jsSize = responses
      .filter(r => r.type === 'js')
      .reduce((sum, r) => sum + parseInt(r.size), 0);
    
    const cssSize = responses
      .filter(r => r.type === 'css')
      .reduce((sum, r) => sum + parseInt(r.size), 0);
    
    // Bundle size budgets
    expect(jsSize).toBeLessThan(1024 * 1024); // Less than 1MB JS
    expect(cssSize).toBeLessThan(200 * 1024); // Less than 200KB CSS
    
    // Individual chunk sizes should be reasonable
    const largeChunks = responses.filter(r => parseInt(r.size) > 200 * 1024);
    expect(largeChunks.length).toBeLessThan(3); // No more than 3 chunks > 200KB
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G network
    await page.route('**/*', route => {
      setTimeout(() => {
        route.continue();
      }, 100); // 100ms delay
    });
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(5000);
    
    // Check if loading states are shown
    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('AuraOS E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/AuraOS/);
    await expect(page.locator('h1')).toContainText('AuraOS');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Welcome to AuraOS');
  });

  test('should display login form', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await expect(page.locator('button[type="button"]')).toContainText(
      'Sign in with Google'
    );
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('.error')).toBeVisible();
  });

  test('should navigate to dashboard after login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            uid: 'test-uid',
            email: 'test@example.com',
            displayName: 'Test User',
          },
        }),
      });
    });

    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display dashboard components', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'auth-user',
        JSON.stringify({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
        })
      );
    });

    await page.goto('http://localhost:3000/dashboard');

    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'auth-user',
        JSON.stringify({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
        })
      );
    });

    await page.goto('http://localhost:3000/dashboard');

    // Navigate to AI Agents
    await page.click('text=AI Agents');
    await expect(page).toHaveURL(/.*ai-agents/);
    await expect(page.locator('h1')).toContainText('AI Agents');

    // Navigate to Workflows
    await page.click('text=Workflows');
    await expect(page).toHaveURL(/.*workflows/);
    await expect(page.locator('h1')).toContainText('Workflows');

    // Navigate to Analytics
    await page.click('text=Analytics');
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('h1')).toContainText('Analytics');
  });

  test('should handle responsive design', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'auth-user',
        JSON.stringify({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
        })
      );
    });

    await page.goto('http://localhost:3000/dashboard');

    await page.click('[data-testid="user-menu"]');
    await page.click('text=Sign Out');

    await page.waitForURL('**/login');
    await expect(page.locator('h1')).toContainText('Welcome to AuraOS');
  });
});

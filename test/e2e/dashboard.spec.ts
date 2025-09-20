import { test, expect } from '@playwright/test';

test.describe('AuraOS Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth-user', JSON.stringify({
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
      }));
    });

    await page.goto('http://localhost:3000/dashboard');
  });

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome back, Test User');
  });

  test('should show user statistics', async ({ page }) => {
    await expect(page.locator('[data-testid="stat-card"]')).toHaveCount(4);
    await expect(page.locator('text=Total Workflows')).toBeVisible();
    await expect(page.locator('text=Active Agents')).toBeVisible();
    await expect(page.locator('text=Messages Today')).toBeVisible();
    await expect(page.locator('text=Success Rate')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
  });

  test('should show quick actions', async ({ page }) => {
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
    await expect(page.locator('text=Create Workflow')).toBeVisible();
    await expect(page.locator('text=Add AI Agent')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
  });

  test('should handle quick action clicks', async ({ page }) => {
    // Test Create Workflow
    await page.click('text=Create Workflow');
    await expect(page).toHaveURL(/.*workflows.*create/);
    
    await page.goBack();
    
    // Test Add AI Agent
    await page.click('text=Add AI Agent');
    await expect(page).toHaveURL(/.*ai-agents.*create/);
    
    await page.goBack();
    
    // Test View Analytics
    await page.click('text=View Analytics');
    await expect(page).toHaveURL(/.*analytics/);
  });

  test('should display navigation sidebar', async ({ page }) => {
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=AI Agents')).toBeVisible();
    await expect(page.locator('text=Workflows')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should handle sidebar navigation', async ({ page }) => {
    // Navigate to AI Agents
    await page.click('[data-testid="sidebar"] >> text=AI Agents');
    await expect(page).toHaveURL(/.*ai-agents/);
    
    // Navigate to Workflows
    await page.click('[data-testid="sidebar"] >> text=Workflows');
    await expect(page).toHaveURL(/.*workflows/);
    
    // Navigate to Analytics
    await page.click('[data-testid="sidebar"] >> text=Analytics');
    await expect(page).toHaveURL(/.*analytics/);
    
    // Navigate back to Dashboard
    await page.click('[data-testid="sidebar"] >> text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display user profile menu', async ({ page }) => {
    await page.click('[data-testid="user-avatar"]');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Sign Out')).toBeVisible();
  });

  test('should handle user menu actions', async ({ page }) => {
    await page.click('[data-testid="user-avatar"]');
    
    // Test Profile
    await page.click('[data-testid="user-menu"] >> text=Profile');
    await expect(page).toHaveURL(/.*profile/);
    
    await page.goBack();
    
    // Test Settings
    await page.click('[data-testid="user-avatar"]');
    await page.click('[data-testid="user-menu"] >> text=Settings');
    await expect(page).toHaveURL(/.*settings/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test mobile navigation
    await page.click('[data-testid="mobile-menu"] >> text=AI Agents');
    await expect(page).toHaveURL(/.*ai-agents/);
  });

  test('should handle search functionality', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'workflow');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    await expect(page).toHaveURL(/.*search.*workflow/);
    await expect(page.locator('text=Search Results')).toBeVisible();
  });
});

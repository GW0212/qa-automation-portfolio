import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../utils/testData';

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  비주얼 회귀 테스트 (Visual Regression Testing)           │
 * │  Playwright의 toHaveScreenshot()을 활용한 스냅샷 비교     │
 * │                                                          │
 * │  첫 실행: 기준 스크린샷(snapshot) 자동 생성               │
 * │  이후 실행: 기준과 현재 화면 픽셀 단위 비교               │
 * └─────────────────────────────────────────────────────────┘
 *
 * 업데이트 명령어: npx playwright test --update-snapshots
 */
test.describe('📸 비주얼 회귀 테스트', () => {

  test.describe('로그인 페이지 스냅샷', () => {
    test('로그인 페이지 전체 화면 스냅샷', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // 첫 실행 시 기준 이미지 생성, 이후 비교
      await expect(page).toHaveScreenshot('login-page-full.png', {
        fullPage: true,
        // 픽셀 차이 허용 범위 (안티앨리어싱 등으로 인한 소폭 차이 허용)
        maxDiffPixelRatio: 0.02,
      });
    });

    test('로그인 폼 영역만 스냅샷', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      const form = page.locator('.login-box');
      await expect(form).toHaveScreenshot('login-form.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('인벤토리 페이지 스냅샷', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);
    });

    test('상품 목록 페이지 전체 스냅샷', async ({ page }) => {
      await expect(page).toHaveScreenshot('inventory-page-full.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });

    test('헤더 영역 스냅샷', async ({ page }) => {
      const header = page.locator('.primary_header');
      await expect(header).toHaveScreenshot('header.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('반응형 뷰포트 스냅샷', () => {
    const viewports = [
      { name: 'desktop-1920', width: 1920, height: 1080 },
      { name: 'desktop-1280', width: 1280, height: 720 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'mobile-375', width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      test(`로그인 페이지 ${vp.name} 뷰포트 스냅샷`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await expect(page).toHaveScreenshot(`login-${vp.name}.png`, {
          maxDiffPixelRatio: 0.03,
        });
      });
    }
  });
});

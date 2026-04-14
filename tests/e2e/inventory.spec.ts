import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, PRODUCTS } from '../../utils/testData';
import { isSortedAscending, isSortedDescending } from '../../utils/helpers';

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  E2E 테스트: 쇼핑 플로우 (Inventory & Cart)              │
 * │  대상 사이트: https://www.saucedemo.com                   │
 * └─────────────────────────────────────────────────────────┘
 */
test.describe('🛒 상품 & 장바구니 E2E 테스트', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  // 각 테스트 전 로그인 완료 상태로 시작
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.assertPageLoaded();
  });

  // ──────────────────────────────────────────────────────────
  // 상품 목록
  // ──────────────────────────────────────────────────────────
  test.describe('📦 상품 목록', () => {
    test(`총 ${PRODUCTS.TOTAL_COUNT}개의 상품이 표시되어야 함`, async () => {
      const count = await inventoryPage.getProductCount();
      expect(count).toBe(PRODUCTS.TOTAL_COUNT);
    });

    test('상품 이름 목록이 기대값과 일치해야 함', async () => {
      const names = await inventoryPage.getProductNames();
      for (const expected of PRODUCTS.NAMES) {
        expect(names).toContain(expected);
      }
    });

    test('A-Z 정렬 후 이름이 오름차순인지 확인', async () => {
      await inventoryPage.sortBy('az');
      const names = await inventoryPage.getProductNames();
      expect(isSortedAscending(names)).toBe(true);
    });

    test('Z-A 정렬 후 이름이 내림차순인지 확인', async () => {
      await inventoryPage.sortBy('za');
      const names = await inventoryPage.getProductNames();
      expect(isSortedDescending(names)).toBe(true);
    });

    test('가격 낮은순 정렬 후 가격이 오름차순인지 확인', async () => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getProductPrices();
      expect(isSortedAscending(prices)).toBe(true);
    });

    test('가격 높은순 정렬 후 가격이 내림차순인지 확인', async () => {
      await inventoryPage.sortBy('hilo');
      const prices = await inventoryPage.getProductPrices();
      expect(isSortedDescending(prices)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────
  // 장바구니 기능
  // ──────────────────────────────────────────────────────────
  test.describe('🛒 장바구니 기능', () => {
    test('상품 1개 추가 → 장바구니 배지 숫자 1 표시', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(1);
    });

    test('상품 2개 추가 → 장바구니 배지 숫자 2 표시', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.addProductToCart('Sauce Labs Bike Light');
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(2);
    });

    test('장바구니 아이콘 클릭 → 장바구니 페이지 이동', async () => {
      await inventoryPage.goToCart();
      await expect(inventoryPage['page']).toHaveURL(/.*cart/);
    });
  });

  // ──────────────────────────────────────────────────────────
  // 전체 구매 플로우 (End-to-End)
  // ──────────────────────────────────────────────────────────
  test.describe('🏁 전체 구매 플로우', () => {
    test('상품 추가 → 장바구니 → 결제 완료 전체 플로우', async ({ page }) => {
      // 1. 상품 추가
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      expect(await inventoryPage.getCartCount()).toBe(1);

      // 2. 장바구니 이동
      await inventoryPage.goToCart();
      await expect(page.locator('.cart_item')).toHaveCount(1);

      // 3. 체크아웃 버튼 클릭
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/.*checkout-step-one/);

      // 4. 개인정보 입력
      await page.locator('[data-test="firstName"]').fill('QA');
      await page.locator('[data-test="lastName"]').fill('Tester');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();
      await expect(page).toHaveURL(/.*checkout-step-two/);

      // 5. 주문 확인 및 완료
      await page.locator('[data-test="finish"]').click();
      await expect(page).toHaveURL(/.*checkout-complete/);
      await expect(page.locator('.complete-header')).toContainText('Thank you');
    });
  });
});

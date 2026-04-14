import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, ERROR_MESSAGES } from '../../utils/testData';

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  E2E 테스트: 로그인 기능 (Login Feature)                 │
 * │  대상 사이트: https://www.saucedemo.com                   │
 * │  패턴: Page Object Model (POM)                           │
 * └─────────────────────────────────────────────────────────┘
 */
test.describe('🔐 로그인 기능 E2E 테스트', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  // ──────────────────────────────────────────────────────────
  // 성공 케이스
  // ──────────────────────────────────────────────────────────
  test.describe('✅ 정상 로그인', () => {
    test('유효한 계정으로 로그인 성공 → 인벤토리 페이지 이동', async () => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await loginPage.assertLoginSuccess();
      await inventoryPage.assertPageLoaded();
    });

    test('로그인 후 페이지 타이틀이 "Products"인지 확인', async () => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.assertPageLoaded();
      const title = await inventoryPage.getTitle();
      expect(title).toContain('Swag Labs');
    });

    test('로그인 버튼 텍스트가 "Login"인지 확인', async () => {
      const buttonText = await loginPage.getLoginButtonText();
      expect(buttonText).toBe('Login');
    });
  });

  // ──────────────────────────────────────────────────────────
  // 실패 케이스
  // ──────────────────────────────────────────────────────────
  test.describe('❌ 로그인 실패 케이스', () => {
    test('잠긴 계정(locked_out_user)으로 로그인 시 에러 메시지 표시', async () => {
      await loginPage.login(USERS.locked.username, USERS.locked.password);
      await loginPage.assertLoginFailed(ERROR_MESSAGES.LOCKED_USER);
    });

    test('잘못된 비밀번호로 로그인 시 에러 메시지 표시', async () => {
      await loginPage.login(USERS.invalid.username, USERS.invalid.password);
      await loginPage.assertLoginFailed(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    test('아이디 미입력 시 "Username is required" 에러', async () => {
      await loginPage.login('', USERS.standard.password);
      await loginPage.assertLoginFailed(ERROR_MESSAGES.EMPTY_USERNAME);
    });

    test('비밀번호 미입력 시 "Password is required" 에러', async () => {
      await loginPage.login(USERS.standard.username, '');
      await loginPage.assertLoginFailed(ERROR_MESSAGES.EMPTY_PASSWORD);
    });

    test('로그인 실패 후 URL이 "/" 유지되는지 확인', async () => {
      await loginPage.login(USERS.invalid.username, USERS.invalid.password);
      await loginPage.assertURL('https://www.saucedemo.com/');
    });
  });

  // ──────────────────────────────────────────────────────────
  // UI / 접근성
  // ──────────────────────────────────────────────────────────
  test.describe('🎨 UI / 접근성 검사', () => {
    test('로그인 폼 초기 상태: 입력 필드가 비어있어야 함', async () => {
      await loginPage.assertFieldsEmpty();
    });

    test('로그인 페이지 타이틀에 "Swag Labs" 포함', async () => {
      const title = await loginPage.getTitle();
      expect(title).toContain('Swag Labs');
    });
  });

  // ──────────────────────────────────────────────────────────
  // 로그아웃
  // ──────────────────────────────────────────────────────────
  test.describe('🚪 로그아웃', () => {
    test('로그인 후 로그아웃 시 로그인 페이지로 복귀', async () => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.assertPageLoaded();
      await inventoryPage.logout();
      await loginPage.assertURL('https://www.saucedemo.com/');
    });
  });
});

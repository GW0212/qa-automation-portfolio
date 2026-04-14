import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — SauceDemo 로그인 페이지 POM
 *
 * @example
 * const loginPage = new LoginPage(page);
 * await loginPage.navigate('/');
 * await loginPage.login('standard_user', 'secret_sauce');
 */
export class LoginPage extends BasePage {
  // Locator 선언 (페이지 요소를 미리 정의)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
  }

  /**
   * 로그인 페이지로 이동
   */
  async goto(): Promise<void> {
    await this.navigate('/');
    await expect(this.loginLogo).toBeVisible();
  }

  /**
   * 로그인 실행
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * 에러 메시지 반환
   */
  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * 로그인 성공 여부 확인 (인벤토리 페이지로 이동하면 성공)
   */
  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory/);
  }

  /**
   * 로그인 실패 여부 확인
   */
  async assertLoginFailed(expectedError: string): Promise<void> {
    const msg = await this.getErrorMessage();
    expect(msg).toContain(expectedError);
  }

  /**
   * 입력 필드가 비어있는지 확인
   */
  async assertFieldsEmpty(): Promise<void> {
    await expect(this.usernameInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
  }

  /**
   * 로그인 버튼 텍스트 확인
   */
  async getLoginButtonText(): Promise<string> {
    return (await this.loginButton.textContent()) ?? '';
  }
}

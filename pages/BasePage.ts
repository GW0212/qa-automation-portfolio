import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — 모든 Page Object의 기반 클래스
 * Page Object Model (POM) 패턴 구현
 *
 * 공통 동작(navigate, wait, screenshot 등)을 추상화하여
 * 각 페이지 클래스에서 재사용할 수 있도록 합니다.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 지정한 URL로 이동
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * 현재 페이지 URL 반환
   */
  getURL(): string {
    return this.page.url();
  }

  /**
   * 페이지 타이틀 반환
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * 특정 텍스트가 페이지에 보일 때까지 대기
   */
  async waitForText(text: string, timeout = 5000): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible({ timeout });
  }

  /**
   * 특정 선택자가 나타날 때까지 대기
   */
  async waitForSelector(selector: string, timeout = 5000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * 스크린샷 저장 (테스트 이름 기반)
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * 페이지 로드 완료 대기
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 로컬스토리지 값 가져오기
   */
  async getLocalStorage(key: string): Promise<string | null> {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * 쿠키 가져오기
   */
  async getCookies() {
    return this.page.context().cookies();
  }

  /**
   * 현재 페이지가 올바른 URL인지 검증
   */
  async assertURL(expectedURL: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  /**
   * 현재 페이지 타이틀 검증
   */
  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}

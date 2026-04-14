import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * InventoryPage — SauceDemo 상품 목록 페이지 POM
 */
export class InventoryPage extends BasePage {
  private readonly productList: Locator;
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;
  private readonly sortDropdown: Locator;
  private readonly burgerMenu: Locator;
  private readonly logoutLink: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.pageTitle = page.locator('.title');
  }

  /**
   * 페이지 로드 확인
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.page).toHaveURL(/.*inventory/);
  }

  /**
   * 전체 상품 개수 반환
   */
  async getProductCount(): Promise<number> {
    return this.productList.count();
  }

  /**
   * 특정 상품 이름 목록 반환
   */
  async getProductNames(): Promise<string[]> {
    const names = this.page.locator('.inventory_item_name');
    const count = await names.count();
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push((await names.nth(i).textContent()) ?? '');
    }
    return result;
  }

  /**
   * 특정 상품을 장바구니에 추가
   */
  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item', { hasText: productName });
    await product.locator('button').click();
  }

  /**
   * 장바구니 아이템 수 반환 (배지)
   */
  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt((await this.cartBadge.textContent()) ?? '0', 10);
  }

  /**
   * 정렬 방식 변경
   */
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * 상품 가격 목록 반환 (숫자 배열)
   */
  async getProductPrices(): Promise<number[]> {
    const prices = this.page.locator('.inventory_item_price');
    const count = await prices.count();
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await prices.nth(i).textContent()) ?? '$0';
      result.push(parseFloat(text.replace('$', '')));
    }
    return result;
  }

  /**
   * 로그아웃 실행
   */
  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('/');
  }

  /**
   * 장바구니 페이지로 이동
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/.*cart/);
  }
}

/**
 * testData.ts — 테스트용 데이터 상수 모음
 *
 * 하드코딩된 값을 한 곳에서 관리하여 유지보수를 쉽게 합니다.
 */

// ──────────────────────────────────────────────────────────
// 사용자 계정 (SauceDemo)
// ──────────────────────────────────────────────────────────
export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

// ──────────────────────────────────────────────────────────
// API 테스트 엔드포인트 (JSONPlaceholder)
// ──────────────────────────────────────────────────────────
export const API = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  ENDPOINTS: {
    POSTS: '/posts',
    USERS: '/users',
    TODOS: '/todos',
    COMMENTS: '/comments',
    ALBUMS: '/albums',
  },
} as const;

// ──────────────────────────────────────────────────────────
// 에러 메시지
// ──────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match',
  EMPTY_USERNAME: 'Epic sadface: Username is required',
  EMPTY_PASSWORD: 'Epic sadface: Password is required',
} as const;

// ──────────────────────────────────────────────────────────
// 상품 관련
// ──────────────────────────────────────────────────────────
export const PRODUCTS = {
  TOTAL_COUNT: 6,
  NAMES: [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
  ],
  PRICES: {
    BACKPACK: 29.99,
    BIKE_LIGHT: 9.99,
    CHEAPEST: 7.99,
    MOST_EXPENSIVE: 49.99,
  },
} as const;

// ──────────────────────────────────────────────────────────
// 타임아웃 설정 (ms)
// ──────────────────────────────────────────────────────────
export const TIMEOUTS = {
  SHORT: 3_000,
  DEFAULT: 10_000,
  LONG: 30_000,
} as const;

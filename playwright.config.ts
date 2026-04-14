import { defineConfig, devices } from '@playwright/test';

/**
 * QA Automation Portfolio — Playwright Configuration
 * @author neocraft
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: './tests',

  // 전체 타임아웃 (ms)
  timeout: 30_000,

  // expect() 타임아웃
  expect: {
    timeout: 5_000,
  },

  // 실패 시 재시도 횟수 (CI에서는 2회)
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행 워커 수
  workers: process.env.CI ? 2 : undefined,

  // 테스트 리포터 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // 전역 설정 (모든 테스트에 공통 적용)
  use: {
    // 베이스 URL (E2E 테스트 대상 사이트)
    baseURL: 'https://www.saucedemo.com',

    // 스크린샷: 실패 시 자동 캡처
    screenshot: 'only-on-failure',

    // 비디오 레코딩: 실패 시 자동 저장
    video: 'retain-on-failure',

    // 트레이스: CI에서 첫 번째 재시도 시 기록
    trace: 'on-first-retry',

    // 뷰포트 크기
    viewport: { width: 1280, height: 720 },
  },

  // 멀티 브라우저 프로젝트 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 모바일 테스트
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/e2e/**',
    },
  ],

  // 결과물 저장 폴더
  outputDir: 'test-results/',
});

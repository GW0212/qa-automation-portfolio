import { Page, APIRequestContext } from '@playwright/test';

/**
 * helpers.ts — 공통 헬퍼 함수 모음
 *
 * 테스트 전처리(setup), 공통 액션, 데이터 생성 등
 * 반복되는 코드를 재사용 가능한 함수로 묶습니다.
 */

// ──────────────────────────────────────────────────────────
// 랜덤 데이터 생성
// ──────────────────────────────────────────────────────────

/**
 * 랜덤 이메일 생성
 */
export function generateEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}@qatest.com`;
}

/**
 * 랜덤 문자열 생성
 */
export function generateString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * 랜덤 정수 생성
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ──────────────────────────────────────────────────────────
// 날짜/시간 유틸
// ──────────────────────────────────────────────────────────

/**
 * 현재 타임스탬프 문자열 반환 (파일명에 사용)
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * 특정 초 만큼 대기 (sleep)
 */
export function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// ──────────────────────────────────────────────────────────
// 배열/오브젝트 유틸
// ──────────────────────────────────────────────────────────

/**
 * 배열이 오름차순 정렬되었는지 확인
 */
export function isSortedAscending(arr: (string | number)[]): boolean {
  return arr.every((val, i) => i === 0 || val >= arr[i - 1]);
}

/**
 * 배열이 내림차순 정렬되었는지 확인
 */
export function isSortedDescending(arr: (string | number)[]): boolean {
  return arr.every((val, i) => i === 0 || val <= arr[i - 1]);
}

// ──────────────────────────────────────────────────────────
// API 헬퍼
// ──────────────────────────────────────────────────────────

/**
 * API 응답이 정상 상태코드인지 확인
 */
export function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * API 응답 JSON 파싱 + 기본 유효성 검사
 */
export async function parseAndValidateResponse<T>(
  request: APIRequestContext,
  url: string
): Promise<T> {
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(`API 요청 실패: ${response.status()} ${response.statusText()}`);
  }
  return response.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────
// 브라우저 유틸
// ──────────────────────────────────────────────────────────

/**
 * 새 탭 열기 및 반환
 */
export async function openNewTab(page: Page): Promise<Page> {
  const context = page.context();
  const newPage = await context.newPage();
  return newPage;
}

/**
 * 현재 페이지 스크롤을 맨 아래로
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

/**
 * 콘솔 에러 로그 수집기 등록
 * 테스트 시작 시 호출하면 콘솔 에러를 배열에 누적합니다.
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

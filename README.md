# 🎭 QA Automation Portfolio

> **Playwright + TypeScript** 기반의 E2E · API · Visual Regression 자동화 테스트 프레임워크

[![CI](https://github.com/YOUR_GITHUB_ID/qa-automation-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_GITHUB_ID/qa-automation-portfolio/actions)
[![Playwright](https://img.shields.io/badge/Playwright-1.44-45ba4b?logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 개요

이 프로젝트는 실무 QA 엔지니어링 역량을 보여주기 위한 포트폴리오용 자동화 테스트 프레임워크입니다.  
**Page Object Model(POM)** 패턴을 기반으로, 유지보수가 쉽고 확장 가능한 구조를 지향합니다.

| 구분 | 내용 |
|------|------|
| **E2E 테스트** | [SauceDemo](https://www.saucedemo.com) — 로그인, 상품 목록, 장바구니, 결제 플로우 |
| **API 테스트** | [JSONPlaceholder](https://jsonplaceholder.typicode.com) — GET/POST/PUT/PATCH/DELETE 전 메서드 |
| **Visual 테스트** | Playwright 스냅샷 비교 — 멀티 뷰포트(데스크탑/태블릿/모바일) |
| **CI/CD** | GitHub Actions — 멀티 브라우저 자동 실행, PR 결과 댓글 |

---

## 🏗️ 프로젝트 구조

```
qa-automation-portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI 파이프라인
├── pages/                      # Page Object Model (POM)
│   ├── BasePage.ts             # 공통 액션/검증 기반 클래스
│   ├── LoginPage.ts            # 로그인 페이지 POM
│   └── InventoryPage.ts        # 상품 목록 페이지 POM
├── tests/
│   ├── e2e/
│   │   ├── login.spec.ts       # 로그인 E2E 테스트 (9개 케이스)
│   │   └── inventory.spec.ts   # 쇼핑 플로우 E2E 테스트 (11개 케이스)
│   ├── api/
│   │   └── jsonplaceholder.spec.ts  # REST API 테스트 (13개 케이스)
│   └── visual/
│       └── snapshot.spec.ts    # 비주얼 회귀 테스트 (7개 케이스)
├── utils/
│   ├── testData.ts             # 테스트 데이터 상수 관리
│   └── helpers.ts              # 공통 헬퍼 함수
├── playwright.config.ts        # Playwright 설정 (멀티 브라우저)
├── tsconfig.json
└── package.json
```

---

## ✨ 주요 특징

### 🧩 Page Object Model (POM)
- `BasePage` 추상 클래스로 공통 액션 중앙화
- 각 페이지 클래스가 Locator를 캡슐화 → 셀렉터 변경 시 한 곳만 수정
- `assertURL`, `waitForText` 등 재사용 가능한 검증 메서드

### 🧪 테스트 유형
- **E2E**: 사용자 시나리오 기반 종단간 테스트
- **API**: HTTP 메서드별 상태코드, 응답 구조, 타입 검증
- **Visual**: 픽셀 단위 스냅샷 비교로 UI 회귀 감지

### 🌐 멀티 브라우저
- Chromium / Firefox / WebKit (Safari)
- Mobile Chrome (Pixel 5 에뮬레이션)

### 📊 리포트
- HTML 리포트 (`playwright-report/`)
- JSON 결과 파일 (`test-results/results.json`)
- 실패 시 자동 스크린샷 & 비디오 저장

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
npx playwright install
```

### 2. 전체 테스트 실행

```bash
npm test
```

### 3. 특정 테스트만 실행

```bash
# E2E 테스트만
npm run test:e2e

# API 테스트만
npm run test:api

# 비주얼 테스트만
npm run test:visual

# 특정 브라우저만
npx playwright test --project=firefox

# UI 모드 (브라우저 창 띄워서 실행)
npm run test:headed
```

### 4. 테스트 리포트 열기

```bash
npm run report
```

### 5. 디버깅

```bash
# 인터랙티브 디버그 모드
npm run test:debug

# Playwright Inspector로 셀렉터 탐색
npm run codegen
```

### 6. 비주얼 스냅샷 기준 이미지 갱신

```bash
npx playwright test --update-snapshots
```

---

## 📋 테스트 케이스 목록

### 🔐 로그인 E2E (`tests/e2e/login.spec.ts`)

| # | 테스트 이름 | 유형 |
|---|-----------|------|
| 1 | 유효한 계정으로 로그인 성공 → 인벤토리 페이지 이동 | Happy Path |
| 2 | 로그인 후 타이틀 "Products" 확인 | Validation |
| 3 | 로그인 버튼 텍스트 "Login" 확인 | UI |
| 4 | 잠긴 계정 로그인 → 에러 메시지 표시 | Negative |
| 5 | 잘못된 비밀번호 → 에러 메시지 표시 | Negative |
| 6 | 아이디 미입력 → "Username is required" | Negative |
| 7 | 비밀번호 미입력 → "Password is required" | Negative |
| 8 | 로그인 실패 후 URL "/" 유지 | Negative |
| 9 | 로그인 후 로그아웃 → 로그인 페이지 복귀 | Scenario |

### 🛒 쇼핑 플로우 E2E (`tests/e2e/inventory.spec.ts`)

| # | 테스트 이름 | 유형 |
|---|-----------|------|
| 1 | 총 6개 상품 표시 | Validation |
| 2 | 상품 이름 목록 일치 확인 | Validation |
| 3 | A-Z 정렬 오름차순 확인 | Functional |
| 4 | Z-A 정렬 내림차순 확인 | Functional |
| 5 | 가격 낮은순 정렬 확인 | Functional |
| 6 | 가격 높은순 정렬 확인 | Functional |
| 7 | 상품 추가 → 배지 숫자 1 | Functional |
| 8 | 상품 2개 추가 → 배지 숫자 2 | Functional |
| 9 | 장바구니 아이콘 클릭 → 이동 | Navigation |
| 10 | 전체 구매 플로우 (추가→결제→완료) | E2E Scenario |

### 🔌 API 테스트 (`tests/api/jsonplaceholder.spec.ts`)

| # | 테스트 이름 | 메서드 |
|---|-----------|--------|
| 1 | GET /posts → 100개 배열 반환 | GET |
| 2 | GET /posts/1 → 필드 구조 검증 | GET |
| 3 | GET /posts?userId=1 → 필터링 검증 | GET |
| 4 | GET /users → 10명, 이메일 형식 검증 | GET |
| 5 | GET /todos → completed 타입 boolean | GET |
| 6 | GET /posts/9999 → 404 반환 | GET |
| 7 | POST /posts → 201, 생성된 데이터 확인 | POST |
| 8 | POST /posts → 응답에 id 포함 | POST |
| 9 | PUT /posts/1 → 200, 전체 수정 | PUT |
| 10 | PATCH /posts/1 → 200, 부분 수정 | PATCH |
| 11 | DELETE /posts/1 → 200, 빈 응답 | DELETE |
| 12 | Content-Type: application/json 검증 | Header |

---

## 🔧 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| [Playwright](https://playwright.dev) | 1.44 | 테스트 프레임워크 (E2E, API, Visual) |
| [TypeScript](https://typescriptlang.org) | 5.4 | 타입 안전성, 코드 품질 |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD 자동화 |

---

## 📈 CI/CD 파이프라인

```
Push / PR
    ↓
GitHub Actions 트리거
    ↓
┌──────────┬──────────┬──────────┐
│ Chromium │ Firefox  │ WebKit   │
│  E2E+API │  E2E     │  E2E     │
└──────────┴──────────┴──────────┘
    ↓ (실패 시)
스크린샷 + 비디오 아티팩트 저장
    ↓ (PR인 경우)
결과 댓글 자동 첨부
```

스케줄: **매일 오전 9시(KST)** 자동 실행

---

## 📄 라이선스

MIT License — 포트폴리오 및 학습 목적으로 자유롭게 사용 가능합니다.

---

> Made with 🎭 Playwright by **neocraft**

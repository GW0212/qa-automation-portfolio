import { test, expect } from '@playwright/test';
import { API } from '../../utils/testData';
import { isSuccessStatus } from '../../utils/helpers';

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  API 테스트: JSONPlaceholder REST API                    │
 * │  엔드포인트: https://jsonplaceholder.typicode.com         │
 * │  커버리지: GET / POST / PUT / PATCH / DELETE             │
 * └─────────────────────────────────────────────────────────┘
 *
 * Playwright의 APIRequestContext를 활용한 REST API 자동화
 */

// 타입 정의
interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
  };
}

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// ──────────────────────────────────────────────────────────
// GET 테스트
// ──────────────────────────────────────────────────────────
test.describe('📋 GET 요청 테스트', () => {
  test('GET /posts → 상태코드 200, 배열 반환', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.POSTS}`);

    expect(response.status()).toBe(200);
    expect(isSuccessStatus(response.status())).toBe(true);

    const posts: Post[] = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(100);
  });

  test('GET /posts/1 → 단일 포스트 반환, 필드 검증', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/1`);

    expect(response.status()).toBe(200);

    const post: Post = await response.json();
    expect(post).toHaveProperty('id', 1);
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(typeof post.title).toBe('string');
    expect(post.title.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 → userId=1인 포스트만 반환', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.POSTS}?userId=1`);

    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => {
      expect(post.userId).toBe(1);
    });
  });

  test('GET /users → 사용자 10명, 필수 필드 존재', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.USERS}`);

    expect(response.status()).toBe(200);

    const users: User[] = await response.json();
    expect(users.length).toBe(10);

    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user.email).toMatch(/@/);
    });
  });

  test('GET /todos → completed 필드가 boolean 타입인지 확인', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.TODOS}`);
    const todos: Todo[] = await response.json();

    todos.forEach((todo) => {
      expect(typeof todo.completed).toBe('boolean');
    });
  });

  test('GET /posts/9999 → 존재하지 않는 리소스: 404 반환', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/9999`);
    expect(response.status()).toBe(404);
  });
});

// ──────────────────────────────────────────────────────────
// POST 테스트
// ──────────────────────────────────────────────────────────
test.describe('📝 POST 요청 테스트', () => {
  test('POST /posts → 새 게시물 생성, 상태코드 201', async ({ request }) => {
    const newPost = {
      title: 'QA Automation Test Post',
      body: 'This is a test created by Playwright API testing',
      userId: 1,
    };

    const response = await request.post(`${API.BASE_URL}${API.ENDPOINTS.POSTS}`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    expect(response.status()).toBe(201);

    const created: Post = await response.json();
    expect(created).toHaveProperty('id');
    expect(created.title).toBe(newPost.title);
    expect(created.body).toBe(newPost.body);
    expect(created.userId).toBe(newPost.userId);
  });

  test('POST /posts → 응답에 생성된 id가 포함되어야 함', async ({ request }) => {
    const response = await request.post(`${API.BASE_URL}${API.ENDPOINTS.POSTS}`, {
      data: { title: 'test', body: 'body', userId: 1 },
    });

    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(typeof body.id).toBe('number');
  });
});

// ──────────────────────────────────────────────────────────
// PUT 테스트
// ──────────────────────────────────────────────────────────
test.describe('✏️ PUT 요청 테스트', () => {
  test('PUT /posts/1 → 게시물 전체 수정, 200 반환', async ({ request }) => {
    const updated = {
      id: 1,
      title: 'Updated by Playwright PUT',
      body: 'Updated body content',
      userId: 1,
    };

    const response = await request.put(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/1`, {
      data: updated,
    });

    expect(response.status()).toBe(200);

    const result: Post = await response.json();
    expect(result.title).toBe(updated.title);
    expect(result.body).toBe(updated.body);
  });
});

// ──────────────────────────────────────────────────────────
// PATCH 테스트
// ──────────────────────────────────────────────────────────
test.describe('🔧 PATCH 요청 테스트', () => {
  test('PATCH /posts/1 → title만 부분 수정, 200 반환', async ({ request }) => {
    const patch = { title: 'Patched title by Playwright' };

    const response = await request.patch(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/1`, {
      data: patch,
    });

    expect(response.status()).toBe(200);

    const result: Post = await response.json();
    expect(result.title).toBe(patch.title);
    // body 필드는 그대로 유지
    expect(result).toHaveProperty('body');
  });
});

// ──────────────────────────────────────────────────────────
// DELETE 테스트
// ──────────────────────────────────────────────────────────
test.describe('🗑️ DELETE 요청 테스트', () => {
  test('DELETE /posts/1 → 상태코드 200, 빈 응답 반환', async ({ request }) => {
    const response = await request.delete(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/1`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({});
  });
});

// ──────────────────────────────────────────────────────────
// 응답 헤더 검증
// ──────────────────────────────────────────────────────────
test.describe('📡 응답 헤더 검증', () => {
  test('Content-Type이 application/json인지 확인', async ({ request }) => {
    const response = await request.get(`${API.BASE_URL}${API.ENDPOINTS.POSTS}/1`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });
});

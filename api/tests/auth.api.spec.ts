import { test, expect } from '@playwright/test';

test('POST /auth/login should return access token with valid credentials', async ({ request }) => {
    const response = await request.post('https://dummyjson.com/auth/login', {
        data: {
            username: 'emilys',
            password: 'emilyspass'
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(typeof body.accessToken).toBe('string');
});

test('POST /auth/login should reject access with wrong password', async ({ request }) => {
    const response = await request.post('https://dummyjson.com/auth/login', {
        data: {
            username: 'emilys',
            password: 'emilypassword'
        }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Object.keys(body).length).toBe(1);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Invalid credentials');
});

test('GET /auth/me with valid token should return user data', async ({ request }) => {
    const loginResponse = await request.post('https://dummyjson.com/auth/login', {
        data: {
            username: 'emilys',
            password: 'emilyspass'
        }
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    const token = loginBody.accessToken;

    const response = await request.get('https://dummyjson.com/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstName');
    expect(body.firstName).toBe('Emily');
});

test('GET /auth/me with NO token should reject authorization', async ({ request }) => {
    const response = await request.get('https://dummyjson.com/auth/me');
    expect(response.status()).toBe(401);
});

test('GET /auth/me with invalid token should reject authorization', async ({ request }) => {
    const response = await request.get('https://dummyjson.com/auth/me', {
        headers: {
            'Authorization': `Bearer garbage123`
        }
    });
    expect(response.status()).toBe(401);
});

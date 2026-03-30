import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
    // Test 1: GET all users - verify 200 and response has users
    test('GET /users should return list of users with status 200', async ({ request }) => {
        const response = await request.get('/users');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
    });

    // Test 2: GET single user - verify 200 and user has expected fields
    test('GET /users/1', async ({ request }) => {
        const response = await request.get('/users/1');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(1);
        expect(body).toHaveProperty('name');
    });

    // Test 3: POST create user - verify 201 and response contains sent data
    test('POST /users/newuserBody should respond with status 201 and sent data', async ({ request }) => {
        const response = await request.post('/users', {
            data: {
                name: 'Harout',
                job: 'QA Engineer'
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.name).toBe('Harout');
    });

    // Test 4: GET non-existent user - verify 404
    test('GET non-existent user should respond with status 404', async ({ request }) => {
        const response = await request.get('/users/999');
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(Object.keys(body).length).toBe(0);
    });

    // Test 5: DELETE user - verify 200
    test('DELETE user should respond with status 200', async ({ request }) => {
        const response = await request.delete('/users/1');
        expect(response.status()).toBe(200);
    });
});
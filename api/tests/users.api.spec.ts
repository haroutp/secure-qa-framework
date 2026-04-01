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

    
    test('GET /users should respond with all expected fields with correct types', async ({ request }) => {
        const response = await request.get('/users');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        for (const user of body) {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('address');
            expect(typeof user.id).toBe('number');
            expect(typeof user.name).toBe('string');
            expect(typeof user.email).toBe('string');
            expect(typeof user.address).toBe('object');
        }
    });

    test('GET /users/1 should respond with all expected fields with correct types', async ({ request }) => {
        const response = await request.get('/users/1');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.id).toBe(1);

        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('email');
        expect(body).toHaveProperty('address');
        expect(typeof body.id).toBe('number');
        expect(typeof body.name).toBe('string');
        expect(typeof body.email).toBe('string');
        expect(typeof body.address).toBe('object');

    });

    test('POST /users with empty body should return 201 (no server-side validation)', async ({ request }) => {
        const response = await request.post('/users', {
            data: {}
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toHaveProperty('id');
    });

    test('GET /nonexistent should respond with a 404', async ({ request }) => {
        const response = await request.get('/nonexistent');
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(Object.keys(body).length).toBe(0);
    });
});
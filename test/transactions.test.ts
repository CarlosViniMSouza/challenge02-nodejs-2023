import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { app } from '../src/app';
import request from 'supertest';

describe('Transactions Routes', () => {
    beforeAll(async () => {
        await app.ready();
    });
    
    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all');
        execSync('npm run knex migrate:latest');
    });
    
    it('User should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 1200,
                type: 'credit',
            })
            .expect(201);
    });

    it('User should be able to list all transactions', async () => {
        const createTransaction = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 1200,
                type: 'credit',
            });

        const cookies = createTransaction.get('Set-Cookie');

        const summaryResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);

        expect(summaryResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 1200,
            }),
        ]);
    });

    it('User should be able to get a specific transaction', async () => {
        const createTransaction = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 1200,
                type: 'credit',
            });

        const cookies = createTransaction.get('Set-Cookie');

        const summaryResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);

        const transactionId = summaryResponse.body.transactions[0].id;

        const getTransaction = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);

        expect(getTransaction.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 1200,
            }),
        );
    });

    it('User should be able to get the summary', async () => {
        const createTransaction = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction (Credit)',
                amount: 1200,
                type: 'credit',
            });

        const cookies = createTransaction.get('Set-Cookie');

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'New transaction (Debit)',
                amount: 100,
                type: 'debit',
            });

        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);

        expect(summaryResponse.body.summary).toEqual({
            amount: 1100,
        });
    });
});
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { knex } from "../database";
import { z } from "zod";

import { checkSessionId } from "../middlewares/check-session-id";

export async function userTransactionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] | ${request.url}`);
    });

    app.get('/', { 
        preHandler: [checkSessionId] 
    }, async (request, reply) => {
        const { sessionId } = request.cookies;

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select();

        return { transactions };
    });

    app.get('/:id', { 
        preHandler: [checkSessionId] 
    }, async (request, reply) => {
        const getTransactionParams = z.object({
            id: z.string().uuid(),
        });

        const { id } = getTransactionParams.parse(request.params);

        const { sessionId } = request.cookies;

        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id,
            })
            .first();

        return { transaction };
    });

    app.get('/summary', { 
        preHandler: [checkSessionId] 
    }, async (request, reply) => {
        const { sessionId } = request.cookies;

        const summary = await knex('transactions')
            .where('session_id', sessionId)
            .sum('date_diet', { as: 'dateDiet' })
            .first();

        return { summary };
    });

    app.post('/', async (request, reply) => {
        const createTransaction = z.object({
            username: z.string(),
            date_diet: z.string(),
            state_daily: z.boolean()
        });

        const { username, date_diet, state_daily } = createTransaction.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId) {
            sessionId = randomUUID();

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });
        }

        await knex('transactions').insert({
            id: randomUUID(),
            username: 'Carlos Souza',
            state_daily: true,
            session_id: sessionId
        });

        return reply.status(201).send();
    });
}
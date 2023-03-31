import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { dbCase } from "../database"; // here i did any changes
import { z } from "zod";

import { checkSessionId } from "../middlewares/check-session-id";

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] | ${request.url}`);
    });

    app.get('/', { 
        preHandler: [checkSessionId] 
    }, async (request, reply) => {
        const { sessionId } = request.cookies;

        const transactions = await dbCase('transactions')
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

        const transaction = await dbCase('transactions')
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

        const summary = await dbCase('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'amount' })
            .first();

        return { summary };
    });

    app.post('/', async (request, reply) => {
        const createTransaction = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        });

        const { title, amount, type } = createTransaction.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId) {
            sessionId = randomUUID();

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });
        }

        await dbCase('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        });

        return reply.status(201).send();
    });
}
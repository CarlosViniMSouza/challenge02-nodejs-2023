import { app } from '../src/app';
import { execSync } from 'child_process';
import { prisma } from '../src/lib/prisma';
import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest';

describe('Diets Routes', () => {
    beforeAll(async () => {
        await app.ready();
    });
    
    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync('npm run prisma migrate:rollback --all');
        execSync('npm run prisma migrate:latest');
    });
    
    it('Deve ser possível criar um usuário', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                description: 'dieta do café',
                date_diet: new Date(),
                current_state: true,
            },
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('Deve ser possível identificar o usuário entre as requisições', async () => {
        
    });

    it('Deve ser possível registrar uma refeição feita, com as seguintes informações', async () => {
        /*
            - Nome
            - Descrição
            - Data e Hora
            - Está dentro ou não da dieta
        */
    });

    it('Deve ser possível editar uma refeição, podendo alterar todos os dados acima', async () => {
        
    });

    it('Deve ser possível apagar uma refeição', async () => {
        
    });

    it('Deve ser possível listar todas as refeições de um usuário', async () => {
        
    });

    it('Deve ser possível visualizar uma única refeição', async () => {
        
    });

    it('Deve ser possível recuperar as métricas de um usuário', async () => {
        /*
            - Quant. Total: refeições registradas
            - Quant. Total: refeições dentro da dieta
            - Quant. Total: refeições fora da dieta
            - Melhor sequência por dia de refeições dentro da dieta
        */
    });

    it('O usuário só pode visualizar, editar e apagar as refeições o qual ele criou', async () => {
        
    });
});

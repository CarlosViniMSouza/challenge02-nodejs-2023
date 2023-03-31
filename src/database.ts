import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

if(!process.env.DB_URL) {
    throw new Error('DB_URL not found!');
}

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DB_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './database/migrations'
    }
}

export const knex = setupKnex(config);
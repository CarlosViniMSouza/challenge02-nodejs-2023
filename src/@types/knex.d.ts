import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            username: string
            date_diet: string
            state_daily: boolean
            session_id?: string
        }
    }
}
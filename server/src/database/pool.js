import { Pool } from "pg";

/**
 * Creates a PostgreSQL Pool using the configuration
 * from the secrets.env file.
 *
 * - Pool set-up reference: https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
 * - Official node-postgres documentation: https://node-postgres.com/api/pool
 */
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

/** Drain the pool of all active PostgreSQL clients on exit */
process.on("exit", () => {
    pool.end();
});

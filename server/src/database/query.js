import { pool } from "./pool";

/**
 * Async function used to connect to PostgreSQL database, acquire a client from
 * the pool and perform a query, returning the result.
 * - By returning a Promise, we can ensure that when we call this function,
 * the promise will always return the result from the database query,
 * or an error if one occurred.
 *
 * @example
 * // Query database for all elements in users table
 * query("SELECT * from users")
 *      .then((res, err) => ...)
 *      .catch((err) => ...)
 *
 * - Promise implementation: https://stackoverflow.com/a/57208802
 *
 * @param {String} query the query to perform on the database
 * @return {Promise} error if any, otherwise the result from the query
 */
export const query = async (query) => {
    try {
        /** Connect to the next available client */
        return new Promise((resolve, reject) => {
            pool.connect((err, client, release) => {
                if (err) {
                    return reject(err);
                }
                /** Use the client to query the database */
                client.query(query)
                    .then((result) => {
                        /** Release (close) the connection with the client */
                        release();
                        /** Return the result in the Promise */
                        return resolve(result);
                    })
                    .catch((err) => {
                        /** Return the rejection error in the Promise */
                        return reject(err);
                    });
            });
        });
    } catch (error) {
        console.error(error);
    }
};

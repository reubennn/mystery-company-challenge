import { query } from "../database/query";

/** All HTTP Status codes referenced from: https://www.restapitutorial.com/httpstatuscodes.html */

/**
 * Fetches all listings from the database.
 *
 * - We only need to get the creation date and name since we will
 * be hiding the message.
 *
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */
export const getAllListings = async (req, res) => {
    query("SELECT id, created, name FROM users")
        .then((result, err) => {
            if (err) {
                res.status(500).json({ error: err });
            }
            result !== undefined ?
                res.status(200).json(result.rows) :
                res.status(500).json({
                    message: "An error occurred while querying the database",
                    error: err,
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: "An error occurred while querying the database",
                error: err,
            });
        });
};

/**
 * Upon the client providing a name, creation date and PIN, the server
 * checks to find the entry in the PostgreSQL database. If the PIN
 * matches the database entry, the server returns the corresponding entry
 * message, otherwise it returns status 401: Unauthorized.
 *
 * - Finding a specific date in query: https://tableplus.com/blog/2018/08/postgresql-how-to-search-by-a-date-from-datetime-fields.html
 *
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */
export const getMessage = async (req, res) => {
    /** Convert all instances of "+" to " " */
    const name = req.params.name.replace("+", " ");
    const created = req.params.created;
    const key = req.params.key; // The PIN number encrypted.

    /** decrypt the PIN key */

    const COLUMNS = "name, created, message, pin";
    const CONDITIONS = `name = '${name}' AND (created >= '${created}'::date)`;
    const QUERY = `SELECT ${COLUMNS} FROM users WHERE ${CONDITIONS}`;

    /** Find the resource in the PostgreSQL database */
    query(QUERY)
        .then((result, err) => {
            if (err) {
                res.status(500).json({
                    message: "An error occurred while querying the database",
                    error: err,
                });
            }
            if (result !== undefined) {
                /** Destructor the data we need from the result */
                const { pin: DATABASE_PIN, message } = result.rows[0];

                /** Check the PIN matches */
                if (parseInt(key) === DATABASE_PIN) {
                    /** Supplied PIN matches database PIN => authenticated */
                    res.status(200).json({ message });
                } else {
                    /** Supplied PIN does not match database PIN */
                    res.status(401).json({
                        error: "Access denied. Incorrect PIN",
                    });
                }
            } else {
                res.status(500).json({
                    error: "There was an error while querying the database",
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: "An error occurred while querying the database",
                error: err,
            });
        });
};

/**
 * Adds an entry to the database with parameters specified
 * in the request body.
 *
 * - On success, the result is returned from the PostgreSQL database.
 * - If the result rows is not undefined, we know the insert was successful,
 * so we can send a response back to the client of the success, otherwise
 * we can send an error as the response.
 *
 * - PostgreSQL INSERT reference: https://www.postgresql.org/docs/9.5/sql-insert.html
 * - RETURNING * command reference: https://stackoverflow.com/a/34968553
 * - Finding the MAX in a query reference: https://stackoverflow.com/a/5360157
 *
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */
export const addEntry = async (req, res) => {
    /** Destructor the body parameters */
    const { name, email, pin, message } = req.body;

    let nextId;
    /**
     * First we need to determine what the next ID will be.
     * - We need to perform a query to find the maximum ID,
     * then we know to increment it by one.
     */
    await query("SELECT MAX(id) FROM users")
        .then((result, err) => {
            if (err) {
                console.error(err);
            }
            /**
             * Make sure the query returned a valid result.
             * - If it did, store the maximum ID and increment by one.
             * - If not, send back error response.
             */
            result.rows !== undefined ?
                nextId = result.rows[0].max + 1 :
                res.status(500).json({
                    message: "An error occurred while querying the database",
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: "An error occurred while querying the database",
                error: err,
            });
        });

    /** Strings for the PostgreSQL query */
    const DATE_NOW = new Date(Date.now()).toISOString();
    const COLUMNS = "(id, name, email, pin, message, created)";

    /** Generate the VALUES string with the data */
    const valuesArr = [nextId, name, email, pin, message, DATE_NOW];
    const VALUES = "'" + valuesArr.join("', '") + "'";

    /** Insert the values into the users table */
    query(`INSERT INTO users ${COLUMNS} VALUES (${VALUES}) RETURNING *`)
        .then((result, err) => {
            if (err) {
                res.status(500).json({ error: err });
            }
            /**
             * Check the entry was created by checking that result
             * rows is not undefined.
             */
            result.rows !== undefined ?
                res.status(200).json({
                    message: "Entry was successfully added to the database",
                }) :
                res.status(500).json({
                    message: "An error occurred while querying the database",
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: "An error occurred while querying the database",
                error: err,
            });
        });
};

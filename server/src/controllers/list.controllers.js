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
    /** Placeholder */
};

/**
 * Fetches a single article from database matching a name from the request.
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
    /** Find the resource in PostgreSQL */
    /** Check the PIN matches */
    /** If it does, send the message back to the client */
    /** If it doesn't, send back authorization error response */
};

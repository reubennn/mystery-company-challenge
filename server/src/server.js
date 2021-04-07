/** dotenv config setup for loading secret environment variables */
import "../config/loadEnv";

import express from "express";
/** Express Server security */
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import rateLimit from "express-rate-limit";

import listRouter from "./api/list.routes";

const PORT = process.env.PORT || 9000;

/** Set up the Express.js app */
const app = express();

/** Helmet helps to secure Express server by setting various HTTP headers. */
app.use(helmet());

/** Use hpp as middleware to protect against HTTP Parameter Pollution attacks */
app.use(hpp());

/** Enable CORS from client origins */
app.use(cors({
    origin: [
        process.env.CLIENT_ORIGIN_URL,
        process.env.CLIENT_ORIGIN_URL_WWW,
    ],
}));

/** Set up the Express Rate Limiter for the API */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
});

/** Apply the Express Rate Limiter to the /api endpoint. */
app.use("/api", apiLimiter);

/**
 * Parse JSON objects included in requests.
 * - Adds body property to the req parameter to the matching route.
 */
app.use(express.json());

/** Use API router as middleware with endpoint "/api" */
app.use("/api", listRouter);

/** Bind Express app and listen for connections */
const server = app.listen(PORT, () => {
    console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
    \nServer listening on PORT ${PORT}.\
    \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`);
});

/* Close the server before Node.js exits */
process.on("exit", () => {
    server.close();
});

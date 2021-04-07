import express from "express";
import {
    getAllListings,
    getMessage,
    addEntry,
} from "../controllers/list.controllers";

/** Set up the Express server router */
const router = new express.Router();

/**
 * Public routes.
 *
 * - For descriptions on what these routes do, see the corresponding
 * functions in src/controllers/list.controllers.js.
 */
router.route("/list")
    .get(getAllListings);

router.route("/get-message/:name/:created/:key")
    .get(getMessage);

router.route("/add-entry")
    .post(addEntry);

export default router;

import express from "express";
import {
    getAllListings,
    getMessage,
} from "../controllers/list.controllers";

/** Set up the Express server router */
const router = new express.Router();

/**
* Public routes.
*/
router.route("/list")
    .get(getAllListings);

router.route("/get-message/:name/:created/:key")
    .get(getMessage);

export default router;

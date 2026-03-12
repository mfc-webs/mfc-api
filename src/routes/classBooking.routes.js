import express from "express";

import { createBooking, getMyBookings } from "../controllers/classBookings.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// class bookings

router.post("/book", requireAuth, createBooking);
router.get("/my-bookings", requireAuth, getMyBookings);

export default router;
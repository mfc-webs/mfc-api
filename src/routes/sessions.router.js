// routes/sessions.routes.js
import express from "express";
import { getSessions } from "../controllers/classSession.controller.js";
import { requireAuth } from '../middleware/requireAuth.js';
import { requireGym } from "../middleware/gym.middleware.js";

const router = express.Router();

router.get("/", requireGym, getSessions);

export default router;
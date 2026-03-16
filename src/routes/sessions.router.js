// routes/sessions.routes.js
import express from "express";
import { getSessions } from "../controllers/classSession.controller.js";
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get("/", getSessions);

export default router;
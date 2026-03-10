// routes/sessions.routes.js
import express from "express";
import { getSessions } from "../controllers/admin/classSession.controller.js";

const router = express.Router();

router.get("/", getSessions);

export default router;
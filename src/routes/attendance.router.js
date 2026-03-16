import express from "express";
import { createCheckin, getCheckinStatus } from "../controllers/admin/attendance.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getMyStats } from "../controllers/member/attendance.controller.js";

const router = express.Router();

router.post("/checkin", requireAuth, createCheckin);
router.get("/stats", requireAuth, getMyStats);
router.get("/status/:user_id", requireAuth, getCheckinStatus);



export default router;

import express from "express";
import { createCheckin, getCheckinStatus } from "../controllers/admin/attendance.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getMyStats } from "../controllers/member/attendance.controller.js";
import { requireGym } from "../middleware/gym.middleware.js";

const router = express.Router();

router.post("/checkin", requireGym, requireAuth, createCheckin);
router.get("/stats", requireGym, requireAuth, getMyStats);
router.get("/status/:user_id", requireGym, requireAuth, getCheckinStatus);



export default router;

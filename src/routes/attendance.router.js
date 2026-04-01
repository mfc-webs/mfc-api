import express from "express";
import { createCheckin, getCheckinStatus } from "../controllers/admin/attendance.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getMyStats } from "../controllers/member/attendance.controller.js";
import { requireGym } from "../middleware/gym.middleware.js";

const router = express.Router();

router.post("/checkin", requireAuth, requireGym, createCheckin);
router.get("/stats", requireAuth, requireGym, getMyStats);
router.get("/status/:user_id", requireAuth, requireGym, getCheckinStatus);



export default router;

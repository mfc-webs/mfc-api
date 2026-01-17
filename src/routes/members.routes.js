import { Router } from "express";
import { getMembers, deleteMember, updateMemberTier, createMember } from "../controllers/members.controller.js";

const router = Router();

router.get("/api/members", getMembers);
router.post("/api/members", createMember);           
router.delete("/api/members/:id", deleteMember);
router.patch("/api/members/:id/tier", updateMemberTier);

export default router;

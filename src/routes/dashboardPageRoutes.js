import { viewDashboard } from "../controllers/dashboard/dashboardController.js";
import { viewEditProfile, viewMemberActivities, viewMemberBlling, viewMemberNutrition, viewMemberPersonalDetails, viewMemberPortal, viewMemberReports } from "../controllers/dashboard/member/member.controller.js";

import express from "express";

const router = express.Router();

// admin dashboard

router.get("/admin-dashboard", viewDashboard);

// member dashboard/portals

router.get("/member/portal", viewMemberPortal);
router.get("/member/activities", viewMemberActivities);
router.get("/member/nutrition", viewMemberNutrition);
router.get("/member/personal-details", viewMemberPersonalDetails);
router.get("/member/edit-profile", viewEditProfile);
router.get("/member/billing", viewMemberBlling);
router.get("/member/reports", viewMemberReports);

export default router;
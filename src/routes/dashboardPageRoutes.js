
import express from "express";

import { viewDashboard } from "../controllers/admin/dashboardController.js";
import { viewMemberPortal } from "../controllers/member/portal.controller.js";
import { viewMemberActivities } from "../controllers/member/activities.controller.js";
import { viewMemberNutrition } from "../controllers/member/nutrition.controller.js";
import { viewMemberPersonalDetails } from "../controllers/member/personalDetails.controller.js";
import { viewEditProfile, updateMemberProfile, updatePassword } from "../controllers/member/editProfile.controller.js";
import { viewMemberBlling } from "../controllers/member/billing.controller.js";
import { viewMemberReports } from "../controllers/member/reports.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { hydrateMember } from "../middleware/hydrateMember.js";
import { uploadProfilePic } from "../middleware/uploadProfilePic.js";


const router = express.Router();



router.use("/member", requireAuth, hydrateMember);


//update member profile detail
router.post("/member-profile/update", requireAuth, uploadProfilePic.single("profile_picture"), updateMemberProfile);
router.post("/member-password/update", requireAuth, updatePassword);

// admin dashboard

router.get("/admin/dashboard", viewDashboard);

// member dashboard/portals

router.get("/member/portal", viewMemberPortal);
router.get("/member/activities", requireAuth, viewMemberActivities);
router.get("/member/nutrition", requireAuth, viewMemberNutrition);
router.get("/member/personal-details", requireAuth, viewMemberPersonalDetails);
router.get("/member/edit-profile", requireAuth, viewEditProfile);
router.get("/member/billing", requireAuth, viewMemberBlling);
router.get("/member/reports", requireAuth, viewMemberReports);

export default router;
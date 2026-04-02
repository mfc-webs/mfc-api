
import express from "express";

import { viewMemberPortal } from "../controllers/member/portal.controller.js";
import { viewMemberActivities } from "../controllers/member/activities.controller.js";
import { getMemberDietary, updateMemberDietary, viewMemberNutrition } from "../controllers/member/nutrition.controller.js";
import { deleteEmergencyContact, getEmergencyContacts, updateEmsDetails, updateHealthRecord, updatePersonalDetails, viewMemberPersonalDetails } from "../controllers/member/personalDetails.controller.js";
import { viewEditProfile, updateMemberProfile, updatePassword } from "../controllers/member/editProfile.controller.js";
import { viewMemberBlling } from "../controllers/member/billing.controller.js";
import { viewMemberReports } from "../controllers/member/reports.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadProfilePic } from "../middleware/uploadProfilePic.js";
import { getPhysiqueLifestyle, updatePhysiqueLifestyle } from "../controllers/member/physiqueLifestyleController.js";
import { hydrateMember } from "../middleware/hydrateMember.js";
import { getMyStats } from "../controllers/member/attendance.controller.js";
import { requireGym } from "../middleware/gym.middleware.js";

const router = express.Router();

router.use("/member", requireAuth, requireGym, hydrateMember); 
//// - - - member dashboard update routes - - - //

// update member's personal details View
router.get("/personal-details", requireAuth, requireGym,  viewMemberPersonalDetails);
router.post("/member-personal-details-update", requireAuth, requireGym,  updatePersonalDetails)
router.get("/member-emergency-contacts", requireAuth, requireGym,  getEmergencyContacts);
router.post("/member-emergency-contact-update", requireAuth, requireGym,  updateEmsDetails)
router.delete("/member-emergency-contact/:id", requireAuth, requireGym,  deleteEmergencyContact);
router.post("/member-health-record", requireAuth, requireGym,  updateHealthRecord)

// member nutritional diet and physique
router.get("/nutrition", requireAuth, requireGym,  viewMemberNutrition, getMemberDietary, getPhysiqueLifestyle);
router.post("/dietary", requireAuth, requireGym,  updateMemberDietary);
router.post("/physiqueLifestyle", requireAuth, requireGym,  updatePhysiqueLifestyle)


// update edit profile routes
router.post("/member-profile-update", requireAuth, requireGym,  uploadProfilePic.single("profile_picture"), updateMemberProfile);
router.post("/member-password-update", requireAuth, requireGym,  updatePassword);

// member dashboard/portals

router.get("/portal", viewMemberPortal);
router.get("/activities", requireAuth, requireGym,  viewMemberActivities);
router.get("/edit-profile", requireAuth, requireGym,  viewEditProfile);
router.get("/billing", requireAuth, requireGym,  viewMemberBlling);
router.get("/reports", requireAuth, requireGym,  viewMemberReports);

// get attendace stats
router.get("/stats", requireAuth, requireGym,  getMyStats);


export default router;
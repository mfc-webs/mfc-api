import { Router } from "express";
import { getMembers, deleteMember, updateMemberTier, createMember, viewMemberDetails, viewAllMembers } from "../controllers/admin/members.controller.js";
import { getClassActivities } from "../controllers/admin/classActivities.controller.js";
import { getAllClassTypes, createClassType, updateClassType, deleteClassType } from "../controllers/admin/classActivities.controller.js";



const router = Router();

// - - - admin dashboard - - - // 

// router.get("/admin/dashboard", viewDashboard);

// - - - activities - - - //

router.get('/class-activities', getClassActivities);
router.get("/api/class-types", getAllClassTypes);
router.post("/api/class-types", createClassType);
router.put("/api/class-types/:id", updateClassType);
router.delete("/api/class-types/:id", deleteClassType);


// - - - members - - - //
router.get('/all-members', viewAllMembers);
router.get('/member-details/:id', viewMemberDetails);


router.get("/api/members", getMembers);
router.post("/api/members", createMember);           
router.delete("/api/members/:id", deleteMember);
router.patch("/api/members/:id/tier", updateMemberTier);

export default router;

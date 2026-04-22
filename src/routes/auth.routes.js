import { Router } from "express";
import { getSignUpForm, signUp} from "../controllers/auth.controller.js";
import { logoutMember } from "../controllers/logout/auth.logout.controller.js";
import { loginMember, loginForm } from "../controllers/login/auth.login.controller.js";
import { redirectLoggedIn } from "../middleware/requireAdmin.js";
import { requireGym } from "../middleware/gym.middleware.js";


const router = Router();

router.get("/signup",requireGym, getSignUpForm);  
router.post("/signup",requireGym, signUp);


router.get("/login",requireGym, redirectLoggedIn, loginForm);        
router.post("/logged-in",requireGym, loginMember);

router.get("/logout",requireGym, logoutMember)

export default router;

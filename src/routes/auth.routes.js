import { Router } from "express";
import { getSignUpForm, signUp, loginForm, loggedIn } from "../controllers/auth.controller.js";

const router = Router();

router.get("/signup", getSignUpForm);  
router.post("/signup", signUp);

router.get("/login", loginForm);        
router.post("/logged-in", loggedIn);

export default router;

import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../config/db.js";
// import cookieParser from "cookie-parser";
// app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const signToken = (user) =>
  jwt.sign(
    { 
      sub: user.id, 
      role: user.role, 
      email: user.email
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || "2h" 
    });


    // working
export const loginForm = (req, res) => {
  return res.status(200).sendFile(
    path.join(req.app.get("views"), "landing", "partials", "login-form.html")
  );
};


// working
export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const result = await db.query(
      `SELECT id, firstname, lastname, email, role, password
       FROM public.users
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    );

    // ✅ Check if user exists
    const user = result.rows[0];
    if (!user) return res.status(401).json({
      success: false,
      message: "Invalid credentials" });

    
    if (!user.password) {
      return res.status(403).json({ 
        success: false,
        message: "Account not activated. Please set a password first." });
    }

    // ✅ Check password
    const ok = await bcrypt.compare(
      password, 
      user.password);

    if (!ok) return res.status(401).json({ 
      success: false,
      message: "Invalid credentials" 
    });

    const token = signToken(user);

    // store token (so future requests know who you are)
   res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // safer for local dev
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // go to the portal route (not a direct file send)
    return res.status(200).json(({
      success: true,
      message: "Login successful!",
      redirect: "/member/portal"
    }));
    
  } catch (err) {
    return res.status(500).json({ 
     success: false,
     message: "Something went wrong!"
    });
  }
};

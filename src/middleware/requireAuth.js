import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token; // optional chaining to be safe
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    console.log("Cookies:", req.cookies);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
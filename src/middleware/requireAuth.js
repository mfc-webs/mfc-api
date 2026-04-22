import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "You must login first." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user
    req.user = decoded;

    // ✅ CRITICAL: Ensure user belongs to this gym
    if (decoded.gymId !== req.gymId) {
      return res.status(403).json({
        error: "Access denied: wrong gym context"
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
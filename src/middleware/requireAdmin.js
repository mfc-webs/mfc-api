// src/middleware/requireAdmin.js
import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "admin_required",
      message: "You are not authorized to perform this action."
    });
  }

  next();
};

export const redirectLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") return res.redirect("/admin/all-members");
    return res.redirect("/member/portal");
  } catch {
    next();
  }
};
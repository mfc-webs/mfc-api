import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return handleAuthError(req, res, "You must login first.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
  }
};


function handleAuthError(req, res, message) {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({
      success: false,
      message
    });
  }

  return res.status(401).render("errors/auth-error.html", {
    message
  });
}
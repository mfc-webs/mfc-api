import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return handleAuthError(req, res, "You must login first.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    req.gymId = decoded.gymId; // ✅ inject here



    if (!req.gymId) {
      return res.status(403).json({ error: "No gym context" });
    }

    next();
  } catch (err) {
     return res.status(401).json({ error: "Invalid token" });
  }
};


export const attachUser = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }

  next();
};


// function handleAuthError(req, res, message) {
//   if (req.originalUrl.startsWith("/api")) {
//     return res.status(401).json({
//       success: false,
//       message
//     });
//   }

//   return res.status(401).render("errors/auth-error.html", {
//     message
//   });
// }
export const requireRole = (role) => (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) return res.status(403).json({ success: false, message: `Access denied. ${role}s only.` });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
export const requireGym = (req, res, next) => {
  try {
    const gymId = req.user?.gymId;

    if (!gymId) {
      return res.status(403).json({ error: "Unauthorized: gym context missing" });
    }

    // attach gymId to request
    req.gymId = gymId;

    next();
  } catch (err) {
    console.error("Gym middleware error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const requireGym = (req, res, next) => {
  try {
    const gymId = req.user?.gym_id;

    if (!gymId) {
      return res.status(403).json({
        error: "Unauthorized: gym context missing"
      });
    }

    // attach to request for easy access everywhere
    req.gymId = gymId;

    next();
  } catch (err) {
    console.error("Gym middleware error:", err);

    return res.status(500).json({
      error: "Server error"
    });
  }
};
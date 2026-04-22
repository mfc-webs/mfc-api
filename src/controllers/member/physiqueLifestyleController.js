import * as physiqueService from '../../services/physiqueLifestyleService.js';

export async function getPhysiqueLifestyle(req, res) {
  try {
    const userId = req.user.sub;
    const gymId = req.gymId;

    if (!req.user || !req.user.sub) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated."
      });
    }

    const physique = await physiqueService.getByMemberphysiqueInfo(userId, gymId);
    res.json({ success: true, physique });
  } catch (err) {
    console.error('Physique  info error:', err);
    res.status(500).json({ success: false, message: 'Error fetching Physique info.' });
  }
}

export async function updatePhysiqueLifestyle(req, res) {
  try {
    const userId = req.user.sub;
    const gymId = req.gymId;
    
    const payload = {
      primary_goal: req.body.primary_goal || null,
      current_weight: req.body.current_weight || null,
      target_weight: req.body.target_weight || null,
      height: req.body.height || null,
      waist: req.body.waist || null,
      protein: req.body.protein || null,
      carbs: req.body.carbs || null,
      fats: req.body.fats || null,
      notes: req.body.notes || null,
      occupation: req.body.occupation || null,
      stress_level: req.body.stress_level || null,
      sleep_hours: req.body.sleep_hours || null,
      activity_level: req.body.activity_level || null,
      exercise_frequency: req.body.exercise_frequency || null,
      sitting_hours: req.body.sitting_hours || null,
      current_activities: req.body.current_activities || [],
      training_styles: req.body.training_styles || [],
    };

    const physique = await physiqueService.updateMemberPhysique(userId, payload, gymId);


    res.json({ success: true,
        message: "Data saved successfully!",
        physique
     });

  } catch (err) {
    console.error("PhysiqueLifestyle Save Error FULL:", err);
    console.error("Error message:", err.message);
    console.error("Stack:", err.stack);

  res.status(500).json({
    success: false,
    message: err.message
  });
  }
}

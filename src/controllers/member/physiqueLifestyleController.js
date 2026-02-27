import * as physiqueService from '../../services/physiqueLifestyleService.js';

export async function getPhysiqueLifestyle(req, res) {
  try {
    const userId = req.user.sub;
    const physique = await physiqueService.getByMemberphysiqueInfo(userId);
    res.json({ success: true, physique });
  } catch (err) {
    console.error('Dietary info error:', err);
    res.status(500).json({ success: false, message: 'Error fetching dietary info.' });
  }
}

export async function updatePhysiqueLifestyle(req, res) {
  try {
    const userId = req.user.sub;
    
    
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
      training_styles: req.body.training_styles || []
    };

    const physique = await physiqueService.updateMemeberPhysique(userId, payload);


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

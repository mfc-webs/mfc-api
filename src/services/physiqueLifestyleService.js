import { db } from '../config/db.js';

export async function getByMemberphysiqueInfo(userId) {
  const { rows } = await db.query(
    'SELECT * FROM member_physique_lifestyle WHERE user_id = $1',
    [userId]
  );

  return rows[0] || null;
}

export async function updateMemeberPhysique(userId, data) {
      const { 
        primary_goal, 
        current_weight, 
        target_weight, 
        height, 
        waist, 
        protein, 
        carbs, 
        fats, 
        notes, 
        occupation, 
        stress_level, 
        sleep_hours, 
        activity_level, 
        exercise_frequency, 
        sitting_hours, 
        current_activities, 
        training_styles
    } = data;

 
    const { rows } = await db.query(
      `INSERT INTO member_physique_lifestyle
        (
          user_id,
          primary_goal,
          current_weight,
          target_weight,
          height,
          waist,
          protein,
          carbs,
          fats,
          notes,
          occupation,
          stress_level,
          sleep_hours,
          activity_level,
          exercise_frequency,
          sitting_hours,
          current_activities,
          training_styles
        )
        VALUES
        (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
          primary_goal = $2,
          current_weight = $3,
          target_weight = $4,
          height = $5,
          waist = $6,
          protein = $7,
          carbs = $8,
          fats = $9,
          notes = $10,
          occupation = $11,
          stress_level = $12,
          sleep_hours = $13,
          activity_level = $14,
          exercise_frequency = $15,
          sitting_hours = $16,
          current_activities = $17,
          training_styles = $18,
          updated_at = NOW()
        RETURNING *;`,
       [
        userId, primary_goal, current_weight, target_weight, height, waist, protein, carbs, fats, notes, occupation, stress_level, sleep_hours, activity_level, exercise_frequency, 
        sitting_hours, current_activities, training_styles 
      ]
      
    );

    return rows[0];
  }
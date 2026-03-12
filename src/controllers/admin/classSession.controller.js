import * as classSessionsService from "../../services/classSessions.service.js";
import { db } from "../../config/db.js";

export const createClassSession = async (req, res) => {
  try {
    const session = await classSessionsService.createClassSession(req.body);
    res.status(201).json({ success: true, message: "Session created", session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSession = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `DELETE FROM class_sessions WHERE id = $1`,
      [id]
    );

    res.json({ success: true });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete session"
    });

  }

};

// - - edit session - - //

export const editSession = async (req, res) => {

  try {

    const { id } = req.params;
    const data = req.body;

    const query = `
      UPDATE class_sessions
      SET
        class_type_id = $1,
        starts_at = $2,
        start_time = $3,
        capacity = $4,
        location = $5,
        status = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      data.class_type_id,
      new Date(`${data.date} ${data.time}`),
      data.time,
      data.capacity,
      data.location,
      data.status,
      id
    ];

    const result = await db.query(query, values);

    res.json({
      success: true,
      session: result.rows[0]
    });

  } catch (err) {

    console.error(err);
        console.error("UPDATE SESSION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update session"
    });

  }

};

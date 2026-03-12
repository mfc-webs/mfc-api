import { db } from "../config/db.js";
import * as bookingService from "../services/classBooking.service.js";

export const createBooking = async (req, res) => {

  try {

    const { session_id } = req.body;

    const user_id = req.user?.sub;

    if (!user_id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    await bookingService.createBooking(session_id, user_id);

    res.json({
      ok: true,
      message: "Enrolled successfully"
    });

  } catch (err) {

    if (err.code === "23505") {
      return res.json({
        ok: false,
        message: "Already enrolled"
      });
    }

    console.error(err);

    res.status(500).json({
      ok: false,
      message: "Failed to enroll"
    });

  }

};

export const getMyBookings = async (req,res)=>{

  const user_id = req.user?.sub;

  const result = await db.query(`
    SELECT 
      s.id,
      c.name AS class_name,
      TO_CHAR(s.starts_at,'FMDay') AS day,
      TO_CHAR(s.starts_at,'HH24:MI') AS time
    FROM class_bookings b
    JOIN class_sessions s ON s.id = b.session_id
    JOIN class_types c ON c.id = s.class_type_id
    WHERE b.user_id = $1
  `,[user_id]);

  res.json(result.rows);

};
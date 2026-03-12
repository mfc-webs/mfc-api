import { db } from "../config/db.js";

export const createBooking = async (session_id, user_id) => {

  return db.query(`
    INSERT INTO class_bookings
    (session_id, user_id, booking_status, booked_at)
    VALUES ($1,$2,'booked',NOW())
  `,[session_id, user_id]);

};

export const getUserBookings = async (user_id) => {

  const result = await db.query(`
    SELECT session_id
    FROM class_bookings
    WHERE user_id = $1
    AND booking_status = 'booked'
  `,[user_id]);

  return result.rows;

};
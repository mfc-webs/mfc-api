import { db } from "../config/db.js";

export const getAll = async () => {
    const query = `
        SELECT id, name, description, default_duration_minutes, created_at
        FROM class_types
        ORDER BY created_at DESC
    `;

    const { rows } = await db.query(query);
    return rows;
};

export const createClassType = async (data) => {
    const query = `
        INSERT INTO class_types
        (name, description, default_duration_minutes)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const { rows } = await db.query(query, [
        data.name,
        data.description,
        data.default_duration_minutes
    ]);

    return rows[0];
};

export const updateClassType = async (id, data) => {
    const query = `
        UPDATE class_types
        SET name = $1, description = $2, default_duration_minutes = $3
        WHERE id = $4
        RETURNING *
    `;

    await db.query(query, [
        data.name,
        data.description,
        data.default_duration_minutes,
        id
    ]);

    return rows[0];
};

export const deleteClassType = async (id) => {
    const query = `DELETE FROM class_types WHERE id = $1`;
    await db.query(query, [id]);
    
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`
     CREATE TABLE member_emergency_contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        ecname VARCHAR(150) NOT NULL,
        relationship VARCHAR(100),
        phone VARCHAR(20) NOT NULL,
        priority VARCHAR(20) NOT NULL DEFAULT 'primary',
        ems_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_member_emergency
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        CONSTRAINT chk_priority
            CHECK (priority IN ('primary', 'secondary')),

        CONSTRAINT unique_user_priority
        UNIQUE (user_id, priority)
);

        `);
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS member_emergency_contacts;
  `);
}

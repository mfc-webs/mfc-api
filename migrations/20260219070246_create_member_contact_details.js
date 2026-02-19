/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS public.member_contact_details (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    user_id INTEGER NOT NULL UNIQUE,
    
    whatsapp_number VARCHAR(20),
    alt_phone VARCHAR(20),
    street_address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    notes TEXT,
    
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_contact
        FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS member_contact_details;
  `);
}
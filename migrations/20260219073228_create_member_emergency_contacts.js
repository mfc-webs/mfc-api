/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`
       CREATE TABLE IF NOT EXISTS public.member_emergency_contacts (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            
            user_id INTEGER NOT NULL,
            ecname VARCHAR(150) NOT NULL,
            relationship VARCHAR(100),
            phone VARCHAR(20) NOT NULL,
            priority VARCHAR(20) NOT NULL DEFAULT 'primary',
            ems_notes TEXT,
            
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            
            CONSTRAINT fk_member_emergency
                FOREIGN KEY (user_id)
                REFERENCES public.users (id)
                ON DELETE CASCADE,
                
            CONSTRAINT chk_priority
                CHECK (priority IN ('primary', 'secondary'))
        );

        CREATE UNIQUE INDEX IF NOT EXISTS one_primary_per_member
            ON public.member_emergency_contacts (user_id)
            WHERE priority = 'primary';

        CREATE UNIQUE INDEX IF NOT EXISTS one_secondary_per_member
            ON public.member_emergency_contacts (user_id)
            WHERE priority = 'secondary';


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

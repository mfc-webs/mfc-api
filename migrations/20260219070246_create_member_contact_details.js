/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
   await knex.schema.alterTable("member_contact_details", (table) => {
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export async function down(knex) {
   await knex.schema.alterTable("member_contact_details", (table) => {
    table.dropColumn("updated_at");
  });
}
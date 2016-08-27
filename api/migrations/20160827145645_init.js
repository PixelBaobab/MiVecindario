
exports.up = async function(knex, Promise) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await knex.schema.createTable('houses', function(table) {
    table.uuid('id').primary();
    table.text('house_name').unique();
    table.text('hashed_password');
    table.text('email').unique();
    table.text('check_hash').unique();
    table.text('phone').unique();
    table.text('roles').unique().defaultTo('["neighbor"]');
    table.timestamp('created_at', true).defaultTo(knex.raw('now()'));
    table.timestamp('updated_at', true).defaultTo(knex.raw('now()'));
    //table.json('more', true);
  });
};

exports.down = async function(knex, Promise) {
  return knex.schema.dropTable('houses');
};

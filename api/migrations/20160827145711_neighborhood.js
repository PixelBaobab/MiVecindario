
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('neighborhood', function(table) {
    table.uuid('id').primary();
    table.text('neighborhood_name').unique();
    table.text('houses').defaultTo('[""]');
    table.timestamp('created_at', true).defaultTo(knex.raw('now()'));
    table.timestamp('updated_at', true).defaultTo(knex.raw('now()'));
  });
};

exports.down = async function(knex, Promise) {
  return knex.schema.dropTable('users');
};

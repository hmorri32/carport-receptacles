// knex migrate:latest
// knex migrate:rollback

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('carport', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('why_tho');
      table.string('cleanliness');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('carport')
  ]);
};
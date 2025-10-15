exports.up = function(knex) {
  return knex.schema.createTable('usuarios', table => {
    table.increments('id').primary()
    table.string('login').notNullable().unique()
    table.string('senha').notNullable()
    table.string('nome').notNullable()
    table.specificType('roles', 'text[]').defaultTo('{"USER"}')
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios')
}


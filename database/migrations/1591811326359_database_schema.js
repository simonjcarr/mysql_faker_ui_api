'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DatabaseSchema extends Schema {
  up () {
    this.create('databases', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
      table.string('database_name').notNullable()
      table.boolean('drop').defaultTo(true)
      table.string('project_name').notNullable()
      table.text('project_description')
      table.text('json_config', 'longtext')
      table.timestamps()
    })
  }

  down () {
    this.drop('databases')
  }
}

module.exports = DatabaseSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExportSchema extends Schema {
  up () {
    this.create('exports', (table) => {
      table.increments()
      table.integer('database_id').unsigned().notNullable().references('id').inTable('databases').onDelete('cascade')
      table.integer('tbl_id')
      table.text('sql', 'longtext')
      table.text('format')
      table.text('template', 'longtext')
      table.boolean('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('exports')
  }
}

module.exports = ExportSchema

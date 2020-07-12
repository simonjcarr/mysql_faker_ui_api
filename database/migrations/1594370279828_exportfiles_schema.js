'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExportfilesSchema extends Schema {
  up () {
    this.create('exportfiles', (table) => {
      table.increments()
      table.integer('database_id').unsigned().notNullable().references('id').inTable('databases').onDelete('cascade')
      table.integer('export_id').unsigned().notNullable().references('id').inTable('exports').onDelete('cascade')
      table.string('path',150).notNullable()
      table.string('exporttype', 50)
      table.timestamps()
    })
  }

  down () {
    this.drop('exportfiles')
  }
}

module.exports = ExportfilesSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblSchema extends Schema {
  up () {
    this.create('tbls', (table) => {
      table.increments()
      table.integer('database_id').unsigned().notNullable().references('id').inTable('databases').onDelete('cascade')
      table.string('table_name').notNullable()
      table.string('fake_qty').notNullable()
      table.text('table_comments')
      table.timestamps()
    })
  }

  down () {
    this.drop('tbls')
  }
}

module.exports = TblSchema

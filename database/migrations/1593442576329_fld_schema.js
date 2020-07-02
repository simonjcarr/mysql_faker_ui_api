'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FldSchema extends Schema {
  up () {
    this.create('flds', (table) => {
      table.increments()
      table.integer('tbl_id').unsigned().notNullable().references('id').inTable('tbls').onDelete('cascade')
      table.string('name').notNullable()
      table.string('data_type').notNullable()
      table.string('size').notNullable()
      table.boolean('auto_increment').defaultTo(false)
      table.boolean('nullable').defaultTo(true)
      table.boolean('primary_key').defaultTo(false)
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('flds')
  }
}

module.exports = FldSchema

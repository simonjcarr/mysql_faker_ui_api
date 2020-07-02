'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FldFakeCommandSchema extends Schema {
  up () {
    this.create('fld_fake_commands', (table) => {
      table.increments()
      table.integer('fld_id').unsigned().notNullable().references('id').inTable('flds').onDelete('cascade')
      table.string('command').notNullable()
      table.float('percent').defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('fld_fake_commands')
  }
}

module.exports = FldFakeCommandSchema

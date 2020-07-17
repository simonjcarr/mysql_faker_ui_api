'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RemotedbmappingsSchema extends Schema {
  up () {
    this.create('remotedbmappings', (table) => {
      table.increments()
      table.integer('remotedb_id').unsigned().notNullable().references('id').inTable('remotedbs').onDelete('cascade')
      table.string('remotedb_table').notNullable()
      table.integer('tbl_id').unsigned().notNullable().references('id').inTable('tbls').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('remotedbmappings')
  }
}

module.exports = RemotedbmappingsSchema

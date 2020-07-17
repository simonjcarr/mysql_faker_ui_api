'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RemotedbmappingvaluesSchema extends Schema {
  up () {
    this.create('remotedbmappingvalues', (table) => {
      table.increments()
      table.integer('remotedbmapping_id').unsigned().notNullable().references('id').inTable('remotedbmappings').onDelete('cascade')
      table.string('remotefield').notNullable()
      table.string('fld_id').unsigned().notNullable().references('id').inTable('flds').onDelete(('cascade'))
      table.string('fakecmd').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('remotedbmappingvalues')
  }
}

module.exports = RemotedbmappingvaluesSchema

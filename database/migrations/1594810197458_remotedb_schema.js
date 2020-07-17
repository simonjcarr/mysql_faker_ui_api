'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RemotedbSchema extends Schema {
  up () {
    this.create('remotedbs', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
      table.string('name', 150).notNullable()
      table.string('hostname', 50).notNullable()
      table.integer('port', 6).notNullable()
      table.string('username', 50).notNullable()
      table.string('password', 50).notNullable()
      table.string('database', 50).notNullable()
      table.string('dbtype', 25).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('remotedbs')
  }
}

module.exports = RemotedbSchema

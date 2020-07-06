'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JobsSchema extends Schema {
  up () {
    this.create('jobs', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
      table.integer('database_id').unsigned().notNullable().references('id').inTable('databases').onDelete('cascade')
      table.boolean('running').unsigned().defaultTo(false)
      table.boolean('complete').unsigned().defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('jobs')
  }
}

module.exports = JobsSchema

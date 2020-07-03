'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JoblogSchema extends Schema {
  up () {
    this.create('joblogs', (table) => {
      table.increments()
      table.integer('job_id').unsigned().notNullable().references('id').inTable('jobs').onDelete('cascade')
      table.string('message').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('joblogs')
  }
}

module.exports = JoblogSchema

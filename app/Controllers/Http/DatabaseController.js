'use strict'
const Database = use('App/Models/Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with databases
 */
class DatabaseController {

  async getDatabases({ request, response, auth }) {
    let user = await auth.getUser()
    let databases = await Database.query().where('user_id', user.id).with('tables.fields.commands').fetch()
    return response.json(databases)
  }

  async getDatabase({ params, response, auth}) {
    let user = await auth.getUser()
    let database = await Database.query().where('user_id', user.id).where('id', params.id).with('tables.fields').first()
    return response.json(database)
  }

  async store({ request, response, auth }) {
    console.log(request.input('name'))
    let user = await auth.getUser()
    let database = new Database()
    database.database_name = request.input('name')
    database.drop = request.input('drop')
    database.project_name = request.input('project_name')
    database.project_description = request.input('project_description')
    database.user_id = user.id
    let id = await database.save()
    if(!id) {
      return response.code(400).send('Error saving database')
    }
    return response.json(database)
  }

  async update({ request, params, response, auth}) {
    let user = await auth.getUser()
    let database = await Database.query().where('user_id', user.id).where('id', params.id).first()
    if(!database) {
      return response.code(404).send('Database not found')
    }
    database.database_name = request.input('name')
    database.drop = request.input('drop')
    database.project_name = request.input('project_name')
    database.project_description = request.input('project_description')
    await database.save()
    return response.json(database)
  }

  async destroy({ params, response, auth }) {
    let user = await auth.getUser()
    let database = await Database.query().where('user_id', user.id).where('id', params.id).first()
    if(!database) {
      return response.code(404).send('Database not found')
    }
    await database.delete()
    return response.json(database)
  }

}

module.exports = DatabaseController

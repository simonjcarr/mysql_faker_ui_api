'use strict'

const Response = require('@adonisjs/framework/src/Response')

const Database = use('App/Models/Database')
const Export = use('App/Models/Export')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with exports
 */
class ExportController {
  async store({ request, response, auth }){
    let user = await auth.getUser()
    let database = await Database.query()
    .where('id', request.input('database_id'))
    .where('user_id', user.id)
    .first()
    if(!database){
      return response.status(404).send("Database for user not found")
    }
    let e = new Export()
    e.database_id = request.input('database_id')
    e.tbl_id = request.input('tbl_id')
    e.sql = request.input('sql')
    e.format = request.input('format')
    e.sql_insert_table = request.input('sql_insert_table')
    e.template = request.input('template')
    e.active = request.input('active')
    e.file_name = request.input('file_name')
    await e.save()
    return response.json(e)
  }

  async update({ request, params, response, auth }) {
    let user = await auth.getUser()
    let database = await Database.query()
    .where('id', request.input('database_id'))
    .where('user_id', user.id)
    .first()
    if(!database){
      return response.status(404).send("Database for user not found")
    }
    let e = await Export.find(params.id)
    e.database_id = request.input('database_id')
    e.tbl_id = request.input('tbl_id')
    e.sql = request.input('sql')
    e.format = request.input('format')
    e.sql_insert_table = request.input('sql_insert_table')
    e.template = request.input('template')
    e.active = request.input('active')
    e.file_name = request.input('file_name')
    await e.save()
    return response.json(e)
  }

  async index({ params, response, auth }) {
    let user = await auth.getUser()
    let database = await Database.query()
    .where('id', params.db_id)
    .where('user_id', user.id)
    .first()
    if(!database){
      return response.status(404).send("Database for user not found")
    }

    let e = await Export.query().where('database_id', params.db_id).with('table').with('file').fetch()
    return response.json(e)
  }

  async destroy({ params, response, auth }) {
    let user = await auth.getUser()
    let e = await Export.query().where('id', params.id).with('database').first()
    let jsonE = e.toJSON()
    if(jsonE.database.user_id !== user.id){
      return response.status(403).send("Not Authorized")
    }
    await e.delete()
    return response.json(e)
  }
}

module.exports = ExportController

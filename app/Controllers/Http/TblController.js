'use strict'
const Table = use('App/Models/Tbl')
const Database = use('App/Models/Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tbls
 */
class TblController {

  async getTables({ params, response, auth }) {
    let user = await auth.getUser()
    let database = await Database
    .query()
    .where('user_id', user.id)
    .where('id', params.db_id)
    .with('tables', (builder) => {
      builder.withCount('fields')
    })
    .fetch()
    var jsonData= database.toJSON()
    return response.json(jsonData[0]['tables'])
  }

  async store({ request, response, auth }){
    let user = await auth.getUser()
    let table = new Table()
    table.table_name = request.input('table_name')
    table.fake_qty = request.input('fake_qty')
    table.table_comments = request.input('table_comments')
    table.database_id = request.input('database_id')
    await table.save()
    return response.json(table)
  }

  async update({ request, params, response, auth }){
    let user = await auth.getUser()
    let table = await Table.find(params.tbl_id)
    let jsonTable = table.toJSON()
    let database = await Database.query().where('id', jsonTable.id).where('user_id', user.id).first()
    if(!database){
      return response.status(400).send("Unable to alter table")
    }
    table.table_name = request.input('table_name')
    table.fake_qty = request.input('fake_qty')
    table.table_comments = request.input('table_comments')
    await table.save()
    table = await Table.query().where('id', table.id).with('fields').first()
    return response.json(table)
  }

  async destroy({ params, response, auth }) {
    let user = await auth.getUser()
    let tbl = await Table.query().where('id', params.tbl_id).first()
    let jsonTbl = tbl.toJSON()
    let db = await Database.query().where('id', jsonTbl.database_id).where('user_id', user.id).first()
    if(!db){
      return response.status(400).send('You can\'t delete that table')
    }
    await tbl.delete()
    return response.json(tbl)
  }

  async updateFakeQty({ request, params, response, auth }) {
    let user = await auth.getUser()
    let table = await Table.query().where('id', params.tbl_id).with('database').first()
    let jsonTable = table.toJSON()
    if(jsonTable.database.user_id !== user.id) {
      return response.status(403).send("Not Authorised")
    }
    table.fake_qty = request.input('fake_qty')
    await table.save()
    return response.json(table)

  }

}

module.exports = TblController

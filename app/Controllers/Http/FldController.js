'use strict'
const Database = use('App/Models/Database')
const Table = use('App/Models/Tbl')
const Field = use('App/Models/Fld')
const Command = use('App/Models/FldFakeCommand')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with flds
 */
class FldController {
  async getFields({ params, response, auth}) {
    let user = await auth.getUser()
    let table = await Table.find(params.tbl_id)
    let jsonTable = table.toJSON()
    let database = await Database.query().where('user_id', user.id).where('id', jsonTable.database_id).first()
    if(!database){
      return response.status(404).send("Table not found for user")
    }
    let tableFields = await Table.query().where('id', params.tbl_id).with('fields.commands').fetch()
    let jsonFields = tableFields.toJSON()
    return response.json(jsonFields[0].fields)
  }

  async update({ request, response, params, auth }) {
    let user = await auth.getUser()
    let table = await Table.query().where('id', request.input('tbl_id')).with('database').first()
    let jsonTable = table.toJSON()
    if(jsonTable.database.user_id !== user.id){
      return response.status(403).send("You don't have permission to add fields to this table")
    }
    let field = await Field.find(params.fld_id)
    field.name = request.input('name')
    field.data_type = request.input('data_type')
    field.size = request.input('size')
    field.auto_increment = request.input('auto_increment')
    field.nullable = request.input('nullable')
    field.idx = request.input('idx')
    field.description = request.input('description')
    await field.save()
    return response.json(field)
  }

  async store({ request, response, auth }) {
    let user = await auth.getUser()
    let table = await Table.query().where('id', request.input('id')).with('database').first()
    let jsonTable = table.toJSON()
    if(jsonTable.database.user_id !== user.id){
      return response.status(403).send("You don't have permission to add fields to this table")
    }
    let field = new Field()
    field.tbl_id = table.id
    field.name = request.input('name')
    field.data_type = request.input('data_type')
    field.size = request.input('size')
    field.auto_increment = request.input('auto_increment')
    field.nullable = request.input('nullable')
    field.primary_key = request.input('primary_key')
    field.idx = request.input('idx')
    field.description = request.input('description')
    await field.save()
    return response.json(field)
  }

  async destroy({ params, response, auth }) {
    let user = await auth.getUser()
    let field = await Field.query().where('id', params.fld_id).with('table.database').first()
    let jsonField = field.toJSON()
    if(jsonField.table.database.user_id !== user.id) {
      return response.status(403).send("Not Authorised")
    }
    await field.delete()
    return response.json(field)
  }

  async storeFakeCommand({ request, response, auth }) {
    let user = await auth.getUser()
    let field = await Field.query().where('id', request.input('field_id')).with('table.database').first()
    let jsonField = field.toJSON()
    if(jsonField.table.database.user_id !== user.id){
      return response.status(403).send("Not Authorised")
    }
    //Store command in database
    let command = new Command()
    command.fld_id = request.input('field_id')
    command.command = request.input('command')
    command.percent = request.input('percent')
    await command.save()
    return response.json(command)
  }

  async getFakeCommands({ params, response, auth }) {
    let user = await auth.getUser()
    let commands = await Field.query().where('id', params.fld_id).with('commands').with('table.database').first()
    let jsonCommands = commands.toJSON()
    if(jsonCommands.table.database.user_id !== user.id){
      return response.status(403).send("Not Authorized")
    }
    return response.json(jsonCommands.commands)
  }

  async updateFakeCommand({ params, request, response, auth}){
    let user = await auth.getUser()
    let command = await Command.query().where('id', params.cmd_id).with('field.table.database').first()
    let jsonCommand = command.toJSON()
    if(jsonCommand.field.table.database.user_id !== user.id) {
      return response.status(403).send("Not Authorized")
    }
    command.command = request.input('command')
    command.percent = request.input('percent')
    await command.save()
    return response.json(command)
  }

  async destroyFakeCommand({ params, response, auth }) {
    let user = await auth.getUser()
    let command = await Command.query().where('id', params.cmd_id).with('field.table.database').first()
    let jsonCommand = command.toJSON()
    if(jsonCommand.field.table.database.user_id !== user.id) {
      return response.status(403).send("Not Authorized")
    }
    await command.delete()
    return response.json(command)
  }
}

module.exports = FldController

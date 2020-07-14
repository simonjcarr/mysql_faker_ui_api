'use strict'
const Database = use('App/Models/Database')
const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const path = require('path')
const Promise = require('bluebird')
const rimraf = require('rimraf')
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
    database.database_name = request.input('database_name')
    database.drop = request.input('drop')
    database.project_name = request.input('project_name')
    database.project_description = request.input('project_description')
    await database.save()
    return response.json(database)
  }

  async destroy({ params, response, auth }) {
    let user = await auth.getUser()
    let database = await Database.query().where('user_id', user.id).where('id', params.id).with('files').first()
    if(!database) {
      return response.code(404).send('Database not found')
    }
    //Delete any export files
    let jsonDatabase = database.toJSON()
    let files = jsonDatabase.files
    try{
      let exportFolder = path.dirname(files[0].path)
      rimraf(exportFolder, () =>{})
    }catch(err){}

    await database.delete()
    return response.json(database)
  }

  async getJSON({ params, response }) {
    let database = await Database.query().where('id', params.db_id).with('tables.fields.commands').first()
    database = database.toJSON()
    let json = {}
    json['database_name'] = database.database_name
    json['drop'] = database.drop
    json['tables'] = []
    await Promise.map(database.tables, async (t) => {
      let table = {
        table_name: '',
        fake_qty: '',
        fields: []
      }
      table.table_name = t.table_name

      //Check if parse int is a number or a string
      let numCheck = parseInt(t.fake_qty)
      if(Object.is(NaN, numCheck)){
        table.fake_qty = t.fake_qty
      }else{
        table.fake_qty = parseInt(t.fake_qty)
      }


      await Promise.map(t.fields, async (f) => {
        let field = {
          name: '',
          data_type: '',
          size: '',
          ai: false,
          null: false,
          pk: false,
          index: false,
          default: "",
          fake: []
        }
        field.name = f.name
        field.data_type = f.data_type
        field.size = f.size
        field.ai = f.auto_increment?true:false
        field.null = f.nullable?true:false
        field.pk = f.primary_key?true:false
        field.index = f.idx?true:false
        field.default = ""

        await Promise.map(f.commands, (c) =>{
          let command = {
            command: '',
            percent: ''
          }
          command.command = c.command
          command.percent = parseFloat(c.percent,2)
          field.fake.push(command)
        })

        table.fields.push(field)

      })
      json.tables.push(table)
    })
    return response.json(json)
  }

  async updateStatus({ params, request, response, auth }) {
    let user = await auth.getUser()
    let database = await Database.query().where('user_id', user.id).where('id', params.id).first()
    if(!database) {
      return response.code(404).send('Database not found for user')
    }
    database.status = request.input('status')
    await database.save()
    return response.json(database)
  }

}

module.exports = DatabaseController

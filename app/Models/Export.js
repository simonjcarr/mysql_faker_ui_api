'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Export extends Model {
  table() {
    return this.belongsTo('App/Models/tbl')
  }
  database() {
    return this.belongsTo('App/Models/Database')
  }
}

module.exports = Export

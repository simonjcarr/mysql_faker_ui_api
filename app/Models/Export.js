'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Export extends Model {
  table() {
    return this.belongsTo('App/Models/Tbl')
  }
  database() {
    return this.belongsTo('App/Models/Database')
  }
  file(){
    return this.hasOne('App/Models/Exportfile')
  }
}

module.exports = Export

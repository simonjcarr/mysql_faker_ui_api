'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fld extends Model {
  table() {
    return this.belongsTo('App/Models/Tbl')
  }
  commands() {
    return this.hasMany('App/Models/FldFakeCommand')
  }
}

module.exports = Fld

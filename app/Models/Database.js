'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Database extends Model {
  tables() {
    return this.hasMany('App/Models/Tbl')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Database

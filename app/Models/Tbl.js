'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tbl extends Model {
  database() {
    return this.belongsTo('App/Models/Database')
  }

  fields() {
    return this.hasMany('App/Models/Fld')
  }
}

module.exports = Tbl

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

  exports() {
    return this.hasMany('App/Models/Export')
  }
}

module.exports = Tbl

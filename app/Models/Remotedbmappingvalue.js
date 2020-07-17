'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Remotedbmappingvalue extends Model {
  mapping() {
    return this.belongsTo('App/Models/Remotedbmapping')
  }
  localfield() {
    return this.belongsTo('App/Models/Fld')
  }
}

module.exports = Remotedbmappingvalue

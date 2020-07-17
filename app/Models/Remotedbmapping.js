'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Remotedbmapping extends Model {
  remotedb(){
    return this.belongsTo('App/Models/Remotedb')
  }
  localtable(){
    return this.belongsTo('App/Models/Tbl')
  }
  mappingvalues() {
    return this.hasMany('App/Models/Remotedbmappingvalues')
  }

}

module.exports = Remotedbmapping

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exportfile extends Model {
  database(){
    return this.belongsTo('App/Models/Database')
  }
  export(){
    return this.belongsTo('App/Models/Export')
  }
}

module.exports = Exportfile

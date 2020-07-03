'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Joblog extends Model {
  job() {
    return this.belongsTo('App/Models/Job')
  }
}

module.exports = Joblog

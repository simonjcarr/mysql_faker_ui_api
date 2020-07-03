'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Job extends Model {
  user() {
    return this.belongsTo('App/Models/User')
  }

  database() {
    return this.belongsTo('App/Models/Database')
  }

  log() {
    return this.hasMany('App/Models/Joblog')
  }
}

module.exports = Job

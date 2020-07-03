'use strict'
const Job = use('App/Models/Job')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with jobs
 */
class JobController {
  async getJob({ params, response, auth }) {
    let user = await auth.getUser()
    let job = await Job.query().where('id', params.job_id).where('user_id', user.id).with('log').first()
    return response.json(job)
  }

  async getUsersJobs({ params, response, auth }) {
    let user = await auth.getUser()
    let jobs = await Job.query().where('user_id', params.user_id).with('log').fetch()
    return response.json(jobs)
  }

  async getDatabaseJobs({ params, response, auth }) {
    let user = await auth.getUser()
    let jobs = await Job.query().where('database_id', params.db_id).with('log').fetch()
    return response.json(jobs)
  }

  async storeJob({ request, response, auth }) {
    let user = await auth.getUser()
    let job = new Job()
    job.database_id = request.input('database_id')
    job.user_id = request.input('user_id')
    await job.save()
    return response.json(job)
  }

  async destroyJob({ params, response, auth }) {
    let user = await auth.getUser()
    let job = Job.query().where('id', params.job_id).first()
    await job.delete()
    return response.json(job)
  }

}

module.exports = JobController

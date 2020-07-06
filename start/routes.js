'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//user Routes
Route.group(() => {
  Route.post('/register', 'UserController.register').validator('register')
  Route.post('/login', 'UserController.login')
}).prefix('api/v1/user')

//Database Routes
Route.group(() => {
  Route.get('/', 'DatabaseController.getDatabases')
  Route.get('/:id', 'DatabaseController.getDatabase')

  Route.post('/', 'DatabaseController.store')
  Route.put('/:id', 'DatabaseController.update')
  Route.delete('/:id', 'DatabaseController.destroy')
}).prefix('api/v1/database').middleware(['auth'])

//Table Routes
Route.group(() => {
  Route.get('/:db_id', 'TblController.getTables')
  // Route.get('/:db_id/:tbl_id', 'TblController.getTable')
  Route.post('/', 'TblController.store')
  Route.put('/:tbl_id', 'TblController.update')
  Route.put('/fake_qty/:tbl_id', 'TblController.updateFakeQty')
  Route.delete('/:tbl_id', 'TblController.destroy')
}).prefix('api/v1/table').middleware(['auth'])

//Field Routes
Route.group(() => {
  Route.get('/:tbl_id', 'FldController.getFields')
  // Route.get('/:tbl_id/:fld_id', 'FldController.getField')
  Route.post('/', 'FldController.store' )
  Route.put('/:fld_id', 'FldController.update')
  Route.delete('/:fld_id', 'FldController.destroy')

  Route.get('/fake_command/:fld_id', 'FldController.getFakeCommands')
  Route.post('/fake_command', 'FldController.storeFakeCommand')
  Route.delete('/fake_command/:cmd_id', 'FldController.destroyFakeCommand')
  Route.put('/fake_command/:cmd_id', 'FldController.updateFakeCommand')
}).prefix('api/v1/field').middleware(['auth'])

//Job Routes
Route.group(()=>{
  Route.get('/:job_id', 'JobController.getJob')
  Route.get('/user/user_id', 'JobController.getUsersJobs')
  Route.get('/database/:db_id', 'JobControler.getDatabaseJobs')
  Route.post('/', 'JobController.storeJob')
  Route.delete('/:job_id', 'JobController.destroyJob')
}).prefix('api/v1/job').middleware(['auth'])

//Job Log Routes
Route.group(()=>{
  Route.get('/:job_id', 'JoblogController.getJobLogs')
  Route.post('/', 'JoblogController.storeLogMessage')
}).prefix('api/v1/job/log').middleware(['auth'])

Route.group(() => {
  Route.get('/:db_id', 'DatabaseController.getJSON')
}).prefix('api/v1/json')

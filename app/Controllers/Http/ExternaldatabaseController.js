'use strict'
var knex = require('knex')({
  client: 'mssql',
  connection: {
    host: '192.168.10.3',
    user: 'simon',
    password: 'Pa55w0rd##',
    database: 'procurement'
  }
})
class ExternaldatabaseController {
  async mssql({ request, response }) {
    let values = await knex.select().from('purchase_orders')
    let schema = await knex.table('purchase_orders').columnInfo()
    console.log(schema)
    return response.json(schema)
  }
}

module.exports = ExternaldatabaseController

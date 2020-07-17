"use strict";
const Remote = use("App/Models/Remotedb");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with remotedbs
 */
class RemotedbController {
  async getUserConnections({ response, auth }) {
    let user = await auth.getUser();
    let connections = await Remote.query().where("user_id", user.id).fetch();
    return response.json(connections);
  }

  async storeConnection({ request, response, auth }) {
    let user = await auth.getUser();
    let connection = new Remote();
    connection.name = request.input("name");
    connection.dbtype = request.input("dbtype");
    connection.hostname = request.input("hostname");
    connection.port = request.input("port");
    connection.username = request.input("username");
    connection.password = request.input("password");
    connection.database = request.input("database");
    await user.connections().save(connection);
    return response.json(connection);
  }

  async testConnection({ request, response }) {
    try {
      var knex = require("knex")({
        client: request.input("dbtype").value,
        connection: {
          host: request.input("hostname"),
          user: request.input("username"),
          password: request.input("password"),
          database: request.input("database"),
          port: request.input("port"),
        },
      });
      // console.log(knex)
      let result = await knex.raw("select 1 + 1 as result");
      if (knex) {
        return response.json({
          result: "connected",
        });
      } else {
        return response.status(400).send();
      }
    } catch (err) {
      console.log(err.message);
      return response.status(400).send(err);
    }
  }

  async getRemoteTables({ params, response, auth }) {
    let user = await auth.getUser();
    let remote = await Remote.query()
      .where("user_id", user.id)
      .where("id", params.remote_id)
      .first();
    if (!remote) {
      return response.status(404).send("Remote not found for user");
    }
    let jsonRemote = remote.toJSON();
    var knex = require("knex")({
      client: jsonRemote.dbtype,
      connection: {
        host: jsonRemote.hostname,
        user: jsonRemote.username,
        password: jsonRemote.password,
        database: jsonRemote.database,
        port: jsonRemote.port,
      },
    });
    let tables = await this.listTables(knex);
    return response.json(tables);
  }

  listTables(knex) {
    return new Promise((resolve, reject) => {
      let query = "";
      let bindings = [];

      switch (knex.client.constructor.name) {
        case "Client_MSSQL":
          query = `SELECT TABLE_NAME
            FROM ${knex.client.database()}.INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'`
          break;
        case "Client_MySQL":
        case "Client_MySQL2":
          query =
            "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";
          bindings = [knex.client.database()];
          break;
        case "Client_Oracle":
        case "Client_Oracledb":
          query = "SELECT table_name FROM user_tables";
          break;
        case "Client_PG":
          query =
            "SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?";
          bindings = [knex.client.database()];
          break;
        case "Client_SQLite3":
          query =
            "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
          break;
      }
      knex.raw(query, bindings).then(function (results) {
        return resolve(results);
      });
    });
  }

  async getTableColumns({ params, response, auth }) {
    let user = await auth.getUser();
    let remote = await Remote.query()
      .where("user_id", user.id)
      .where("id", params.remote_id)
      .first();
    if (!remote) {
      return response.status(404).send("Remote not found for user");
    }
    let jsonRemote = remote.toJSON();
    var knex = require("knex")({
      client: jsonRemote.dbtype,
      connection: {
        host: jsonRemote.hostname,
        user: jsonRemote.username,
        password: jsonRemote.password,
        database: jsonRemote.database,
        port: jsonRemote.port,
      },
    });

    let schema = await knex.raw(`select *
    from INFORMATION_SCHEMA.COLUMNS
    where TABLE_NAME='${params.table_name}'; `)

    let indexes = await knex.raw(`SELECT
    TableName = t.name,
    IndexName = ind.name,
    IndexId = ind.index_id,
    ColumnId = ic.index_column_id,
    ColumnName = col.name,
    ind.*,
    ic.*,
    col.*
FROM
    sys.indexes ind
INNER JOIN
    sys.index_columns ic ON  ind.object_id = ic.object_id and ind.index_id = ic.index_id
INNER JOIN
    sys.columns col ON ic.object_id = col.object_id and ic.column_id = col.column_id
INNER JOIN
    sys.tables t ON ind.object_id = t.object_id
WHERE
    t.name = '${params.table_name}'
ORDER BY
    t.name, ind.name, ind.index_id, ic.index_column_id;`)
    return response.json({schema, indexes})
  }
}

module.exports = RemotedbController;

"use strict";
const Exportfile = use("App/Models/Exportfile");
const { zip } = require("zip-a-folder");
var path = require("path");
const fs = require('fs')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with exportfiles
 */
class ExportfileController {
  async store({ request, response }) {
    try {
      let file = new Exportfile();
      file.database_id = request.input("database_id");
      file.export_id = request.input("export_id");
      file.path = request.input("path");
      file.exporttype = request.input("exporttype");
      await file.save();
      return response.json(file);
    } catch (err) {
      console.log(err);
    }
  }

  async downloadAllZipped({ params, response }) {
    try {
      let files = await Exportfile.query()
        .where("database_id", params.database_id)
        .with("database")
        .fetch();
      if (!files) {
        return response.status(404).send("No Files found");
      }
      try{
        var jsonFiles = files.toJSON();
        var filesFolder = path.dirname(jsonFiles[0].path);
        var database_name = jsonFiles[0].database.database_name;
      }catch(err){}
      await zip(filesFolder, `./${database_name}.zip`);
      return response.download(`./${database_name}.zip`);
    } catch (err) {
      console.log(err);
    }

  }

  async downloadFile({ params, response }) {
    let file = await Exportfile.find(params.file_id);
    return response.download(file.path);
  }
}

module.exports = ExportfileController;

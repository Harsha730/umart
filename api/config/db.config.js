'use strict';


var pwd, props;

//This function loads the properties of DB
exports.load = function loadPropreties() {
  var PropertiesReader = require('properties-reader'); // Importing the properties reader-module
  props = PropertiesReader('./api/config/app.properties'); // getting the instance
  var securityUtils = require('../utils/securityUtil');
  pwd = securityUtils.decrypt(props.get('db.pwd'), props.get('db.token'));
}

//This function exports the required configuration for the DB to be initialized by the sequelize
module.exports = {
  data: this.load(),
  HOST: props.get('db.host'),
  USER: props.get('db.user'),
  PASSWORD: pwd,
  DB: props.get('db.name'),
  dialect: "mysql",
  pool: {
    max: 1000, // Get maximum 400 connections from the connection pool
    min: 10, // Minimum number of connections from the connection pool
    acquire: 30000, //maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000 //maximum time, in milliseconds, that a connection can be idle before being released
  }
};
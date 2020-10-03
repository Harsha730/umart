'use strict';

var appRoot = require('app-root-path'), //Importing the required modules
  winston = require('winston');

const { transports, createLogger, format } = winston; //Constants required for the logging logic


// This function used to get the file name of the Log caller
var getLabel = function (callingModule) {
  var parts = callingModule.filename.split('\\');
  return parts[parts.length - 2] + '/' + parts.pop();
};

// defining the log settings for the file and Console
var options = {
  file1: {
    level: 'info',
    filename: `${appRoot}/logs/server.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  file2: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above

/* This function is used for the logging of whole project */
module.exports = function (callingModule) {
  return new winston.createLogger({
    format: format.combine(
      format.label({ label: getLabel(callingModule) }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.json()
    ),
    transports: [
      new winston.transports.File(options.file1),  //Creating the logger of type INFO
      new winston.transports.File(options.file2),  // creating the logger of type ERROR
      new winston.transports.Console(options.console) // creating the logger of type DEBUG
    ],
    exitOnError: false
  });
}




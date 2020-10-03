'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.verifyEmail = function (email) {

  logger.info("Entered into the verifyEmail function")
   var mail_id=email.split('@');
   email=mail_id[0].toUpperCase()+'@'+mail_id[1].toLowerCase();
   
   var path = require('app-root-path');

   const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
                props = PropertiesReader('./api/config/app.properties'); // getting the instance

            var AWS = require('aws-sdk'),
                filePath = `${path}/api/config/config.json`;
            AWS.config.loadFromPath(filePath);

            // Create promise and SES service object
var verifyEmailPromise = new AWS.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: email}).promise();

// Handle promise's fulfilled/rejected states
verifyEmailPromise.then(
  function(data) {
    console.log("Email verification initiated");
   }).catch(
    function(err) {
    console.error(err, err.stack);
  });
  
  logger.info("End of verifyEmail function");

}


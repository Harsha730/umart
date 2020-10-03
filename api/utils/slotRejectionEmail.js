'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.slotRejectionEmail = function (email,name,notes,vendor,id,date,timing) {

  logger.info("Entered into the slotRejectionEmail function");

  const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
    props = PropertiesReader('./api/config/app.properties'); // getting the instance

  var pwd = securityUtils.decrypt(props.get('email.pwd'), props.get('email.id'));
  date=new Date(date).toDateString();

  // Configuring the mail properties
  const transporter = nodeMailer.createTransport({
    host: props.get('email.host'),
    port: props.get('email.port'),
    secureConnection: true,
    auth: {
      user: props.get('email.user'),
      pass: pwd
    },
    /* tls: {
    ciphers: 'SSLv3'
  }   */
  });

  // Configuring the transporter to the Email instance
  const email_send = new Email({
    transport: transporter,
    send: true,
    preview: false,
  });


  // Logic to send Registration confirmation mail to the vendor
  logger.info("Email type is customer slotRejectionEmail")
  
  email_send.send({
    template: 'slot-rejection',
    message: {
      from: props.get('email.user'),
      to: email,
    },
    locals: {
      name: name,
      outlet_name: vendor.company_name,
      vendor_phone:vendor.phone,
      comments:notes,
      date:date,
      timing:timing
    }
  }).then(function (info) {
    logger.info("successfully sent customer slotRejectionEmail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer slotRejectionEmail :" + error);
    });

  logger.info("End of slotRejectionEmail function");

}


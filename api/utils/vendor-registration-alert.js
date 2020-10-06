'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails

exports.sendMail = function (name, phone,vendor_email,country) {

  logger.info("Entered into the vendor registration alert function")

  const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
    props = PropertiesReader('./api/config/app.properties'); // getting the instance

  var pwd = securityUtils.decrypt(props.get('email.pwd'), props.get('email.id'));

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
  
    logger.info("Email type is vendor registration alert")
    // Logic to send vendor Query Mail to the UniCommerce
    email_send.send({
      template: 'umart44-vendor-register-alert',
      message: {
        from: props.get('email.user'),
        to: props.get('email.cc'),
      },
      locals: {
        vendor_email: vendor_email,
        vendor_name: name,
        vendor_phone: phone,
        vendor_country: country,
      //  vendor_query: query,
      }
    }).then(function (info) {
      logger.info("successfully sent registration alert mail:")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending registration alert mail :" + error);
      })

    // Logic to send Query Confirmation to the vendor  
    
  logger.info("End of vendor registration alert function");

}


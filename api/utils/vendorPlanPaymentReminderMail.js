'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.paymentReminder = function (email,name,price,month,plan_type,id) {

  logger.info("Entered into the vendor plan paymentReminder function");

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
  logger.info("Email type is vendor paymentReminder Email")
  email_send.send({
    template: 'vendor-plan-payment-reminder',
    message: {
      from: props.get('email.user'),
      to: email,
    },
    locals: {
      vendor_name: name,
      price: price,
      month: month,
      plan_type: plan_type,
      id:id
    }
  }).then(function (info) {
    logger.info("successfully sent vendor plan paymentReminder mail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending vendor plan paymentReminder mail :" + error);
    });

  logger.info("End of vendor plan paymentReminder function");

}


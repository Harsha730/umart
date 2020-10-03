'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.slotBookingMail = function (email,vendor_name, booking_id, date, time, count, outlet,name,phone) {

  logger.info("Entered into the slotBookingMail function")

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
    logger.info("Email type is slot-booking Email")
    email_send.send({
      template: 'slot-booking',
      message: {
        from: props.get('email.user'),
        to: email,
      },
      locals: {
        vendor_name: vendor_name,
        ref:booking_id,
        date:date,
        time:time,
        count:count,
        outlet: outlet,
        name: name,
        phone : phone
      }
    }).then(function (info) {
      logger.info("successfully sent slot-booking mail")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending slot-booking mail :" + error);
      });
  
  logger.info("End of slotBookingMail function");

}


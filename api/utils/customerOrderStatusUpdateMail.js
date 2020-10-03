'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.UpdateOrderStatus = function (email, customer_name, outlet_name, order_id, vendor_name, vendor_email, vendor_phone,notes,order_status) {

  logger.info("Entered into the customer UpdateOrderStatus function");

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
  logger.info("Email type is customer UpdateOrderStatus Email")
  email_send.send({
    template: 'ordet-status-update',
    message: {
      from: props.get('email.user'),
      to: email,
    },
    locals: {
      customer_name: customer_name,
      order_id: order_id,
      outlet_name: outlet_name,
      vendor_name: vendor_name,
      vendor_email: vendor_email,
      vendor_phone: vendor_phone,
      notes:notes,
      order_status:order_status
    }
  }).then(function (info) {
    logger.info("successfully sent customer UpdateOrderStatus mail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer UpdateOrderStatus mail :" + error);
    });

  logger.info("End of UpdateOrderStatus function");

}


'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');
const paymentStatus = require('../models/paymentStatus');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.paymentUpdateMail = function (email,customer_name,outlet_name,order_id,vendor_name,vendor_email,vendor_phone,payment_status,payment_type,payment_note,price) {

  logger.info("Entered into the customer paymentUpdateMail function");

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

  if("Paid"==payment_status){
  // Logic to send Registration confirmation mail to the vendor
  logger.info("Email type is customer payment Paid")
  if(Boolean(payment_note))
  payment_note="Note : "+payment_note;
  else
  payment_note=undefined;
  email_send.send({
    template: 'customer-payment',
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
      payment_status:payment_status,
      payment_type:payment_type,
      payment_note:payment_note,
      price:price
    }
  }).then(function (info) {
    logger.info("successfully sent customer payment Paid Mail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer payment paid Mail :" + error);
    });
}
else{
  // Logic to send Registration confirmation mail to the vendor
  logger.info("Email type is customer payment Rejection Email");
  email_send.send({
    template: 'customer-payment-rejection',
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
      payment_status:payment_status,
      payment_type:payment_type,
      order_note:payment_note,
      price:price
    }
  }).then(function (info) {
    logger.info("successfully sent customer paymentUpdateMail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer paymentUpdateMail :" + error);
    });
}

  logger.info("End of paymentUpdateMail function");

}


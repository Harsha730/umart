'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.shipmentFilfillMail = function (email,customer_name,outlet_name,order_id,vendor_name,vendor_email,vendor_phone,shipment_type,shipment_tracking,shipment_notes,shipment_details) {

  logger.info("Entered into the customer shipmentFilfillMail function");

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
  logger.info("Email type is customer shipmentFilfillMail Email")
  email_send.send({
    template: 'customer-order-fullfillment',
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
      shipment_type:shipment_type,
      shipment_tracking:shipment_tracking,
      shipment_notes:shipment_notes,
      address:shipment_details.address,
      city:shipment_details.city.name,
      zip:shipment_details.zip,
      state:shipment_details.state.name,
      country:shipment_details.country.name,
    }
  }).then(function (info) {
    logger.info("successfully sent customer shipmentFilfillMail mail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer shipmentFilfillMail mail :" + error);
    });

  logger.info("End of shipmentFilfillMail function");

}


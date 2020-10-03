'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('../utils/securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.sendMail = function (email, qrCode, name, phone, query, country, isRegistered, isVerify, otp) {

  logger.info("Entered into the sendMail function")

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
  if (isRegistered) {
    logger.info("Email type is Registration confirmation")
    email_send.send({
      template: 'register',
      message: {
        from: props.get('email.user'),
        to: email,
      },
      locals: {
        vendor_name: name,
        id: qrCode,
        email: email
      }
    }).then(function (info) {
      logger.info("successfully sent confirmation mail")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending confirmation mail :" + error);
      });
  } else if (isVerify) {
   // email='MuniSekhar.Muni123@GmAil.cOm';
   /*  var mail_id=email.split('@');
    email=mail_id[0].toUpperCase()+'@'+mail_id[1].toLowerCase(); */
    logger.info("Email type is Vendor Verification")
    email_send.send({
      template: 'verification',
      message: {
        from: props.get('email.user'),
        to: email,
      },
      locals: {
        id: otp,
      }
    }).then(function (info) {
      logger.info("successfully sent verification mail")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending verification mail :" + error);
      });

  }
  else {
    logger.info("Email type is vendor Query")
    // Logic to send vendor Query Mail to the UniCommerce
    email_send.send({
      template: 'query',
      message: {
        from: props.get('email.user'),
        to: props.get('email.cc'),
      },
      locals: {
        vendor_email: email,
        vendor_name: name,
        vendor_phone: phone,
        vendor_country: country,
        vendor_query: query,
      }
    }).then(function (info) {
      logger.info("successfully sent query mail:")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending query mail :" + error);
      })

    logger.info("Email type is Query confirmation")

    // Logic to send Query Confirmation to the vendor  
    email_send.send({
      template: 'query-confirmation',
      message: {
        from: props.get('email.user'),
        to: email,
      },
      locals: {
        vendor_name: name
      }
    }).then(function (info) {
      logger.info("successfully sent query confirmation mail:")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending query confirmation mail :" + error);
      })
  }

  logger.info("End of sendMail function");

}


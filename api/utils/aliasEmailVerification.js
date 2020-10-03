'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('../utils/securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.aliasEmailVerification = function (email,otp) {

  logger.info("Entered into the aliasEmailVerification function")

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

   // email='MuniSekhar.Muni123@GmAil.cOm';
   /*  var mail_id=email.split('@');
    email=mail_id[0].toUpperCase()+'@'+mail_id[1].toLowerCase(); */
    logger.info("Email type is Alias Verification")
    email_send.send({
      template: 'alias-verification',
      message: {
        from: props.get('email.user'),
        to: email,
      },
      locals: {
        id: otp,
      }
    }).then(function (info) {
      logger.info("successfully sent alias-verification mail")
    },
      function (error) {
        logger.error(error);
        logger.error("error occured while sending alias verification mail :" + error);
      });

  logger.info("End of sendMail function");

}


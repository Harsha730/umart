'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.slotConfirmationEmail = function (email,name,count,vendor,id,date,timing) {

  logger.info("Entered into the slotConfirmationEmail function");

  const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
    props = PropertiesReader('./api/config/app.properties'); // getting the instance

  var pwd = securityUtils.decrypt(props.get('email.pwd'), props.get('email.id'));
  date=new Date(date).toDateString();

  let customer_details = (
    '<table style="width:50%">' +
    '<thead>' +
    '<th style="text-align:left"></th>'  +
    '<th style="text-align:left"></th>'  +
    '<th style="text-align:left"></th>' +
    '<th style="text-align:left"></th>' +
    /*...*/
    '</thead>'
  );
  
        customer_details +=(
            '<tr>' +
            '<td style="text-align:left">Visitor Name</td>'  +
            '<td style="text-align:left">' +name+ '</td>' +
            '</tr>'+
           '<tr>'+
           '<td style="text-align:left">No of Attendees</td>'  +
             '<td style="text-align:left">' +count+ '</td>' +
           '</tr>'+
           '<tr>'+
           '<td style="text-align:left">Date</td>'  +
           '<td style="text-align:left">' +date+ '</td>' +
           '</tr>'+
           '<tr>'+
           '<td style="text-align:left">Visiting Time</td>'  +
             '<td style="text-align:left">'+ timing + '</td>' +
           '</tr>'
          );

  customer_details +=  '</table>';

  // console.log(product_details);

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
  logger.info("Email type is customer slot confirmation")
  
  email_send.send({
    template: 'slot-confirmation',
    message: {
      from: props.get('email.user'),
      to: email,
    },
    locals: {
      name: name,
      ref: id,
      outlet_name: vendor.company_name,
      address:vendor.company_address,
      city:vendor.city.name,
      zip:vendor.zip_code,
      state:vendor.state.name,
      country:vendor.country.name,
      customer_details:customer_details,
      date:date,
      timing:timing
    }
  }).then(function (info) {
    logger.info("successfully sent customer slotConfirmationEmail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending customer slotConfirmationEmail:" + error);
    });

  logger.info("End of slotConfirmationEmail function");

}


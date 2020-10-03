'use strict';

//importing the required modules
var nodeMailer = require('nodemailer'),
  securityUtils = require('./securityUtil'),
  logger = require('../config/winston_Logger'),
  Email = require('email-templates');

logger = logger(module); // Passing the module to the logger

// This util is used for sending the mails
exports.orderBooking = function (email, vendor_name,ref,name,phone,price,currency,date,products,data) {

  logger.info("Entered into the vendor orderBooking function");

  const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
    props = PropertiesReader('./api/config/app.properties'); // getting the instance

  var pwd = securityUtils.decrypt(props.get('email.pwd'), props.get('email.id'));
  if(currency==1)
  currency="INR"
  else
  currency="USD"
  var sub_price=price.toFixed(2);
  price=currency+" "+price.toFixed(2);
  date=new Date(date);
  var timeString=new Date(date);
  let product_details = (
    '<table>' +
    '<thead>' +
    '<th style="text-align:left">Name</th>'  +
    '<th style="text-align:left">Quantity</th>'+
    '<th style="text-align:left">Price</th>'+
    '<th style="text-align:left">Amount</th>'+
    /*...*/
    '</thead>'
  );
 
  for (let element of products) {
    // console.log("in customer"+element.price+1);
    var element_price =element.price.toFixed(2);
    var amount=(element.quantity*element.price).toFixed(2);
        product_details += (
            '<tr>' +
             '<td style="text-align:left">' + element.name + '</td>' +
             '<td style="text-align:right">' + element.quantity + '</td>' +
             '<td style="text-align:left">' + element_price+ '</td>' +
             '<td style="text-align:left">'+amount+ '</td>' +
             /*...*/
           '</tr>'
          );
  }

  product_details +=  '</table>';

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
  logger.info("Email type is vendor orderBooking Email")
  // price=price.toFixed(2);
 var tax=data.order.gstTax_price.toFixed(2),total=data.order.grand_total.toFixed(2);
 let payment_details = (
  '<table style="margin-left: 3cm;">' +
  '<thead>' +
  '<th style="text-align:left"></th>'  +
  '<th style="text-align:left"></th>'  +
  '<th style="text-align:left"></th>' +
  /*...*/
  '</thead>'
);
      payment_details +=(
          '<tr>' +
          '<td style="text-align:left">' +"Subtotal"+ '</td>' +
           '<td style="text-align:left">' +sub_price+ '</td>' +
           /*...*/
         '</tr>'+
         '<tr>' +
         '<td style="text-align:left">' + "GST" + '</td>' +
         '<td style="text-align:left">' + tax + '</td>' +
         /*...*/
       '</tr>'+
       '<tr>' +
       '<td style="text-align:left">' + "Total Amount" + '</td>' +
       '<td style="text-align:left">' + total + '</td>' +
        /*...*/
      '</tr>'
        );

payment_details +=  '</table>';
total=currency+" "+total;
  email_send.send({
    template: 'vendor-order-booking',
    message: {
      from: props.get('email.user'),
      to: email,
    },
    locals: {
      vendor_name: vendor_name,
      order_id: ref,
      name: name,
      phone: phone,
      price: total,
      date:date,
      product_details:product_details,
      payment_details:payment_details
    }
  }).then(function (info) {
    logger.info("successfully sent vendor-order-booking mail")
  },
    function (error) {
      logger.error(error);
      logger.error("error occured while sending vendor-order-booking  mail :" + error);
    });

  logger.info("End of vendor-order-booking function");

}


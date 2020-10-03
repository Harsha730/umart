'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { vendor, customer } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

exports.updatePaymentStatus = function (data,res) {
  try {
    var order_id=data.order_id,payment_type=data.payment_type.id,payment_status=data.payment_status.id,payment_notes=data.payment_notes,outlet_name,vendor_name,vendor_email,vendor_phone,name,email,phone;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the updatePaymentStatus");
      db.order.findOne({
        where: {
          id: {
            [op.eq]: order_id //Fetching the order with the order_id
          }
        },
        include:[{
          model:vendor
        },{
          model:customer
        }]
      }).then(order => {
        if (null != order) {
          logger.info("Found the order to update payment details");
          outlet_name=order.vendor.company_name,
          vendor_name=order.vendor.name,
          vendor_phone=order.vendor.phone,
          vendor_email=order.vendor.email;
          name=order.customer.name,
          email=order.customer.email,
          phone=order.customer.phone;
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
          order.update({ payment_type: payment_type, payment_status: payment_status, payment_notes: payment_notes,payment_updated_date:data.updated_date}).then(status => {
            resolve("Order payment details have been updated successfully!.");
            var orderPaymentUpdateMail=require('../utils/customerPaymentUpdateMail');
            var currency;
            if(order.currency_id==1)
            currency="INR";
            else
            currency="USD";
            if(order.grand_total==null)
            order.grand_total=order.price;
            order.price=currency+" "+order.grand_total.toFixed(2);
            orderPaymentUpdateMail.paymentUpdateMail(email,name,outlet_name,order_id,vendor_name,vendor_email,vendor_phone,data.payment_status.name,data.payment_type.name,payment_notes,order.price);
          });
        } else {
          logger.error("Order not found in the DB with the order_id #" + order_id);
          reject(res.status(404).send("Unable to update payment_details as no order matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to update your payment_details. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to update your payment_details. Thank you for your business."));
  }
}
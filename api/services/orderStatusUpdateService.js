'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

exports.updateOrderStatus = function (data,res) {
  try {
    var order_id=data.order_id,outlet_name,vendor_name,vendor_email,vendor_phone,name,email,phone;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the updateOrderStatus service");
      db.order.findOne({
        where: {
          id: {
            [op.eq]: order_id //Fetching the order with the order_id
          }
        },
        include:[{
          model:db.vendor
        },{
          model: db.customer,
        }]
      }).then(order => {
        if (null != order) {
          logger.info("Found the order to update order status");
          outlet_name=order.vendor.company_name,
          vendor_name=order.vendor.name,
          vendor_phone=order.vendor.phone,
          vendor_email=order.vendor.email;
          name=order.customer.name,
          email=order.customer.email,
          phone=order.customer.phone;
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
          order.update({ status: data.status.id,status_notes: data.notes,updated_date:data.updated_date}).then(status => {
            resolve("Order Status Details have been updated successfully!.");
            var orderStatusUpdateMail=require('../utils/customerOrderStatusUpdateMail');
            orderStatusUpdateMail.UpdateOrderStatus(email,name,outlet_name,order_id,vendor_name,vendor_email,vendor_phone,data.notes,data.status.name);
          });
        } else {
          logger.error("Order not found in the DB with the order_id #" + order_id);
          reject(res.status(404).send("Unable to update order status as no order matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to update your order status. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to update your order status. Thank you for your business."));
  }
}
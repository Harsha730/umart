'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

exports.updateShipment = function (data,res) {
  try {
    var order_id=data.order_id,shipment_type=data.shipment_type.id,shipment_tracking=data.shipment_tracking,shipment_notes=data.shipment_notes,outlet_name,vendor_name,vendor_email,vendor_phone,name,email,phone;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the updateShipment service");
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
            include:[{
              model:db.country,
              as:'billing_country'
            },{
              model:db.state,
              as:'billing_state'
            },
            {
              model:db.city,
              as:'billing_city'
            },
            {
              model:db.country,
              as:'shipping_country'
            },{
              model:db.state,
              as:'shipping_state'
            },
            {
              model:db.city,
              as:'shipping_city'
            }] 
        }]
      }).then(order => {
        if (null != order) {
          logger.info("Found the order to update Shipment");
          outlet_name=order.vendor.company_name,
          vendor_name=order.vendor.name,
          vendor_phone=order.vendor.phone,
          vendor_email=order.vendor.email;
          name=order.customer.name,
          email=order.customer.email,
          phone=order.customer.phone;
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
          order.update({ shipment_type: shipment_type, shipment_tracking: shipment_tracking, shipment_notes: shipment_notes,shipment_updated_date:data.updated_date}).then(status => {
            resolve("Order shipment details have been updated successfully!.");
            var orderFulfillmentMail=require('../utils/customerOrderFulfillmentMail');
           var shipping_details=Object.assign({
              address:order.customer.shipping_address,
              zip:order.customer.zip,
              country:order.customer.shipping_country,
              state:order.customer.shipping_state,
              city:order.customer.shipping_city
            })
            orderFulfillmentMail.shipmentFilfillMail(email,name,outlet_name,order_id,vendor_name,vendor_email,vendor_phone,data.shipment_type.name,shipment_tracking,shipment_notes,shipping_details);
          });
        } else {
          logger.error("Order not found in the DB with the order_id #" + order_id);
          reject(res.status(404).send("Unable to update shipment_details as no order matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to update your shipment_details. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to update your shipment details. Thank you for your business."));
  }
}
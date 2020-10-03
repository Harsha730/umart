'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { cities } = require("../controllers/vendorController");

logger = logger(module) // Passing the module to the logger

exports.getOrderList = function (id,status,res) {
  try {
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getOrderList");
      var clause;
      if("true"==status)
      clause={user_status:"true"};
      else if("false"==status)
      clause={user_status:"false"};
      else
      clause=undefined;
      db.vendor.findOne({
        where:{qr_code : id},
        include: [
        // Including all the required modules for the response
          {
            model : db.order,
            include:[{
              model:db.orderStatus,
              as:'orderStatus'
            },
            {
              model:db.currency
            }],
          }
        ]
      }
      ).then(vendor => {
        var resObj;
        if(null!=vendor) {
        resObj = Object.assign(
                {},
                {
                orders: vendor.orders.map(order=> {
                  if(order.gst_percent==null)
                  order.gst_percent=0;
                  if(order.tax_price==null)
                  order.tax_price=0;
                  if(order.grand_total==null)
                  order.grand_total=order.price;
                  if(order.status_notes==null)
                  order.status_notes="";
                  return Object.assign(
                    {},
                    {
                      order_id:order.id,
                      items:order.items,
                      created_date : order.created_date,
                      price:order.price,
                      currency:order.currency.code,
                      status:order.orderStatus,
                      notes:order.status_notes,
                      gst_percentage:order.gst_percent,
                      gstTax_price:order.tax_price,
                      grand_total:order.grand_total
                    });
                }),
            });
        }
        if (null==vendor) {
            resObj = Object.assign(
                {},
                {
                orders:[]
                });
  //logger.error("Vendor not found in the DB with the info #" + id);
          resolve(resObj);
        }
        else {
          logger.info("Found the vendor Orders ::" + id);
          resolve(resObj);
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch orders. Thank you for your business."));
      }))
    })// end of try
  }
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your orders. Thank you for your business."));
  }
}
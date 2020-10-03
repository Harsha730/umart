'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { cities } = require("../controllers/vendorController");

logger = logger(module) // Passing the module to the logger

exports.getBookingList = function (id,status,res) {
  try {
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getOutlet");
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
            model : db.user,
            where : clause,
            include: [{
              model: db.slotTimings,
            }],
          },
          {
              model: db.slotTimings
         }
        ]
      }
      ).then(vendor => {
        var resObj;
        if(null!=vendor) {
        resObj = Object.assign(
                {},
                {
                bookings: vendor.users.map(slot_bookings => {
                  return Object.assign(
                    {},
                    {
                      booking_id:slot_bookings.booking_id,
                      contact_person_name:slot_bookings.name,
                      contact_phone : slot_bookings.phone,
                      contact_email:slot_bookings.email,
                      attendies_count:slot_bookings.attendies_count,
                      vendor_id :slot_bookings.vendor_id,
                      status:slot_bookings.user_status,
                    timings: Object.assign(
                      {},
                      {
                        date:slot_bookings.date,
                        time : slot_bookings.slot_timing.timings,
                      },
                    ),
                    });
                }),
                slot_timings:vendor.slot_timings
            });
        }
        if (null==vendor) {
            resObj = Object.assign(
                {},
                {
                bookings:[],
                slot_timings:[]
                });
  //logger.error("Vendor not found in the DB with the info #" + id);
          resolve(resObj);
        }
        else {
          logger.info("Found the vendor products ::" + id);
          resolve(resObj);
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch products. Thank you for your business."));
      }))
    })// end of try
  }
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
  }
}
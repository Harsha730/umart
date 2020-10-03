'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var productUtil = require('../utils/productUtil'),
  logger = require('../config/winston_Logger');
const { reject } = require("async");

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the product info into the DB 
 to load the product*/

exports.loadPriceBook = async function (data, response) {

  try {

    logger.info("Entered into loadProductFamily function");

    /** This function creates the pricebook (GST Slab) in DB with the provided data if not already exists 
     * Throws Error if exists already
    */

    return new Promise(function (resolve, reject) {
      db.priceBook.findOrCreate({
        // Check for the duplicate vendor with the provided phone and email
        where: {
          [op.and]: [{
            gst_number: {
              [op.eq]: data.gst_number
            }
          }, {
            vendor_id: {
              [op.eq]: data.vendor_id
            }
          }, {
            gst_category: {
              [op.eq]: data.gst_category
            }
          }, {
            gst_slab_id: {
              [op.eq]: data.gst_slab_id
            }
          }]
        },
        // Vendor data that needs to be inserted in DB if not already exists 
        defaults: {
          vendor_id: data.vendor_id,
          gst_number: data.gst_number,
          gst_slab_id: data.gst_slab_id,
          gst_category: data.gst_category
        }
      }).then(status => {
        console.log(JSON.parse(JSON.stringify(status)));
        if (status[1]) {
          // Sending the confirmation mail to the vendor
          logger.info("priceBook inserted successfully");
          resolve("GST information has been added to your outlet successfully!");
        }
        else {
          logger.error("priceBook exists with the provided info ::name/vendor_id ::");
          reject(response.status(409).send("A GST already registered with these details, Please change your category or percentage to add."));
        }
      }).catch(error => {

        logger.error("Error occured while adding the GST " + error);

        reject(response.status(500).send("Internal Server Error! Unable to add your GST. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
      // console.log(created);
      logger.info("End of load priceBook function");
    });

    //Returning the success or failed transaction as promise

  }

  catch (err) {

    logger.error("Error occured while adding the GST " + err);

    reject(response.status(500).send("Internal Server Error! Unable to add your GST. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
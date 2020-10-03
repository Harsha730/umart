'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { products, gst_slabs } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getSlabs= function (response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {
     /*  var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_country
      else
      temp_db=db.country
 */
      logger.info("Entered into getSlabs function");

      // This function fetches all the countries
      db.gst_slabs.findAll({
      }).then(slabs => {
        if (null == slabs) {
          logger.error("slabs not found in the DB");
         // reject(response.status(404).send("Unable to fetch countries"));
         var data=Object.assign(
          {},
          {

          },
        )
         resolve(data);
        }
        else {
          var data=Object.assign(
            {},
            {
              gst_slabs:slabs
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching gst_slabs");
        reject(response.status(500).send("Internal Server Error! Unable to fetch gst_slabs."));
      })

      logger.info("End of gst_slabs function");
    }
    catch (err) {
      logger.error("Error occured while fetching gst_slabs ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch gst_slabs."));
    }
  })
}


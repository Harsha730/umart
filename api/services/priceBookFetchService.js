'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { products } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getPriceBook= function (vendor_id,response) {

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
      db.priceBook.findAll({
        where :{vendor_id:vendor_id},
        include:[{
          model:db.gst_slabs
        }]
      }).then(priceBook => {
        if (null == priceBook) {
          logger.error("countries not found in the DB");
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
              priceBook:priceBook
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching priceBook");
        reject(response.status(500).send("Internal Server Error! Unable to fetch priceBook."));
      })

      logger.info("End of getCountries function");
    }
    catch (err) {
      logger.error("Error occured while fetching countries ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch countries."));
    }
  })
}


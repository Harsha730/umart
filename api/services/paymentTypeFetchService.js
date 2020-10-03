'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getPaymentType= function (param,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getPaymentType function");

      // This function fetches all the countries
      db.paymentType.findAll({
        attributes: ['id','name'],
      }).then(paymentTypes => {
        if (null == paymentTypes) {
          logger.error("payment Types not found in the DB");
          reject(response.status(404).send("Unable to fetch paymentTypes"));
        }
        else {
          var data=Object.assign(
            {},
            {
              payment_types:paymentTypes
            },
          )
          resolve(data);
        }
      }).catch(error => {
        logger.error("Error occured while fetching paymentTypes");
        reject(response.status(500).send("Internal Server Error! Unable to fetch paymentTypes."));
      })

      logger.info("End of paymentTypes function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching paymentTypes ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch paymentTypes."));
    }
  })
}


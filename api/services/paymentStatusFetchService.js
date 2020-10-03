'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getPaymentStatus= function (param,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getPaymentStatus function");

      // This function fetches all the countries
      db.paymentStatus.findAll({
        attributes: ['id','name'],
      }).then(paymentStatus => {
        if (null == paymentStatus) {
          logger.error("payment Status not found in the DB");
          reject(response.status(404).send("Unable to fetch paymentStatus"));
        }
        else {
          var data=Object.assign(
            {},
            {
              payment_status:paymentStatus
            },
          )
          resolve(data);
        }
      }).catch(error => {
        logger.error("Error occured while fetching paymentStatus");
        reject(response.status(500).send("Internal Server Error! Unable to fetch paymentStatus."));
      })

      logger.info("End of paymentStatus function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching paymentStatus ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch paymentStatus."));
    }
  })
}


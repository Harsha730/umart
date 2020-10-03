'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getOrderStatus= function (param,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getOrderStatus function");

      // This function fetches all the countries
      db.orderStatus.findAll({
        attributes: ['id','name'],
      }).then(orderStatus => {
        if (null == orderStatus) {
          logger.error("orderStatus not found in the DB");
          reject(response.status(404).send("Unable to fetch orderStatus"));
        }
        else {
          var data=Object.assign(
            {},
            {
              order_status:orderStatus
            },
          )
          resolve(data);
        }
      }).catch(error => {
        logger.error("Error occured while fetching orderStatus");
        reject(response.status(500).send("Internal Server Error! Unable to fetch orderStatus."));
      })

      logger.info("End of orderStatus function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching orderStatus ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch orderStatus."));
    }
  })
}


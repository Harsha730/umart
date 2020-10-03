'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getShipmentType= function (param,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getShipmentType function");

      // This function fetches all the countries
      db.shipmentType.findAll({
        attributes: ['id','name'],
      }).then(shipmentType => {
        if (null == shipmentType) {
          logger.error("ShipmentType not found in the DB");
          reject(response.status(404).send("Unable to fetch ShipmentType"));
        }
        else {
          var data=Object.assign(
            {},
            {
              shipment_type:shipmentType
            },
          )
          resolve(data);
        }
      }).catch(error => {
        logger.error("Error occured while fetching ShipmentType");
        reject(response.status(500).send("Internal Server Error! Unable to fetch ShipmentType."));
      })

      logger.info("End of ShipmentType function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching ShipmentType ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch ShipmentType."));
    }
  })
}


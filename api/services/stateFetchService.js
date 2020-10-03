'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getStates= function (param,locale,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getStates function");
      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_state
      else
      temp_db=db.state
      // This function fetches all the countries
      temp_db.findAll({
        where: {
            country_id: {
              [op.eq]: param //Fetching the products with the vendor qr_code
            }
          },
      }).then(states => {
        if (null == states) {
          logger.error("states not found in the DB");
          reject(response.status(404).send("Unable to fetch states"));
        }
        else {
          var data=Object.assign(
            {},
            {
              states:states
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching states");
        reject(response.status(500).send("Internal Server Error! Unable to fetch states."));
      })

      logger.info("End of getStates function");

    }
    catch (err) {
      logger.error("Error occured while fetching states ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch states."));
    }
  })
}


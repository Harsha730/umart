'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getCities= function (param,locale,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getCities function");
      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_city
      else
      temp_db=db.city

      // This function fetches all the countries
      temp_db.findAll({
        attributes: ['name','state_id'],
        where: {
              state_id: {
                [op.eq]: param //Fetching the products with the vendor qr_code
              }
            },
      }).then(cities => {
        if (null == cities) {
          logger.error("cities not found in the DB");
          reject(response.status(404).send("Unable to fetch cities"));
        }
        else {
          var data=Object.assign(
            {},
            {
              cities:cities
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching cities");
        reject(response.status(500).send("Internal Server Error! Unable to fetch cities."));
      })

      logger.info("End of getCities function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching cities ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch cities."));
    }
  })
}


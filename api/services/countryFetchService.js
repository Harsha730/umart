'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getCountries= function (locale,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {
      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_country
      else
      temp_db=db.country

      logger.info("Entered into getCountries function");

      // This function fetches all the countries
      temp_db.findAll({
      }).then(countries => {
        if (null == countries) {
          logger.error("countries not found in the DB");
          reject(response.status(404).send("Unable to fetch countries"));
        }
        else {
          var data=Object.assign(
            {},
            {
              countries:countries
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching countries");
        reject(response.status(500).send("Internal Server Error! Unable to fetch countries."));
      })

      logger.info("End of getCountries function");
    }
    catch (err) {
      logger.error("Error occured while fetching countries ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch countries."));
    }
  })
}


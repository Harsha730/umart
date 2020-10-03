'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { currency } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getCurrencies= function (locale,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getCurrencies function");

      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_currency
      else
      temp_db=db.currency

      // This function fetches all the countries
      temp_db.findAll({
      }).then(currency => {
        if (null == currency) {
          logger.error("currencies not found in the DB");
          reject(response.status(404).send("Unable to fetch currecy"));
        }
        else {
          var data=Object.assign(
            {},
            {
              currencies:currency
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching currencies");
        var data=Object.assign(
          {},
          {
            currencies:currency
          },
        )
        resolve(data);
    //   reject(response.status(500).send("Internal Server Error! Unable to fetch currencies."));
      })

      logger.info("End of getCurrencies function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching currencies ::" + err);
      var data=Object.assign(
        {},
        {
          currencies:currency
        },
      )
      resolve(data);
     // reject(response.status(500).send("Internal Server Error! Unable to fetch currencies."));
    }
  })
}


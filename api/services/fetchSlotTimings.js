'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { currency } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getSlotTimings= function (id,locale,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getSlotTimings function");

      var isTranslatedContentAvailable=true;

      if(locale=="te_IN"){
      // This function fetches all the countries
      db.translated_slot_timings.findAll({
        where:{vendor_id:id},
        attributes: ['id','timings','locale'],
       /*  include:[{
          model:db.slotTimings
        }
        ] */
      }).then(timings => {
        console.log(JSON.parse(JSON.stringify(timings)));
        if (0==timings.length) {
          logger.error("Telugu slotTimings not found in the DB");
          db.slotTimings.findAll({
            where:{vendor_id:id},
            attributes: ['id','timings'],
          }).then(timings => {
            if (null == timings) {
              logger.error("slotTimings not found in the DB");
              reject(response.status(404).send("Unable to fetch slot timings."));
            }
            else {
              var data=Object.assign(
                {},
                {
                    slots:timings
                },
              )
              resolve(data);
            }
          }).catch(error => {
            console.log(error);
            logger.error("Error occured while fetching slotTimings");
            reject(response.status(500).send("Internal Server Error! Unable to fetch slotTimings."));
          })
          logger.info("End of get slotTimings function");
       //   reject(response.status(404).send("Unable to fetch slot timings."));
        }
        else {
       //   console.log(isTranslatedContentAvailable);
          var data=Object.assign(
            {},
            {
                locale:'te_IN',
                slots:timings
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching slotTimings");
        reject(response.status(500).send("Internal Server Error! Unable to fetch slotTimings."));
      })
      logger.info("End of get slotTimings function");
    }
    else{
      db.slotTimings.findAll({
        where:{vendor_id:id},
        attributes: ['id','timings'],
      }).then(timings => {
        if (null == timings) {
          logger.error("slotTimings not found in the DB");
          reject(response.status(404).send("Unable to fetch slot timings."));
        }
        else {
          var data=Object.assign(
            {},
            {
                slots:timings
            },
          )
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching slotTimings");
        reject(response.status(500).send("Internal Server Error! Unable to fetch slotTimings."));
      })

      logger.info("End of get slotTimings function");
    }
  }
    catch (err) {
      logger.error("Error occured while fetching slotTimings ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch slotTimings."));
    }
  })
}


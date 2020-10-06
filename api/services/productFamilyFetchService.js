'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { currency } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.getProductFamily= function (param,locale,response) {

  // Creating and returning the Promise
  var clause;
  if(param)
  clause={vendor_id:param};
  else
  clause=undefined;
  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getProductFamily function");

      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_product_family;
      else
      temp_db=db.productFamily
      // This function fetches all the countries
      if(locale=="te_IN"){
        temp_db.findOne({
          where:clause,
        }).then(tempProductFamily=>{
              if(null==tempProductFamily){
                temp_db=db.productFamily;
                temp_db.findAll({
                  where:clause,
                  attributes: ['id','name'],
                }).then(family => {
                  if (null==family) {
                    logger.error(" Telugu productFamily not found in the DB");
                    reject(response.status(404).send("Unable to fetch productFamilies"));
                  }
                  else {
                    var data=Object.assign(
                      {},
                      {
                          productFamilies:family
                      },
                    )
                    resolve(data);
                  }
                }).catch(error => {
                  logger.error("Error occured while fetching productFamilies");
                  var data=Object.assign(
                    {},
                    {
                        productFamilies:family
                    },
                  )
                  resolve(data);
                  //reject(response.status(500).send("Internal Server Error! Unable to fetch productFamilies."));
                })
                logger.info("End of getproductFamilies function");
              }
              else{
                temp_db.findAll({
                  where:clause,
                  attributes: ['id','name'],
                }).then(family => {
                  if (null==family) {
                    logger.error(" Telugu productFamily not found in the DB");
                    reject(response.status(404).send("Unable to fetch productFamilies"));
                  }
                  else {
                    var data=Object.assign(
                      {},
                      {
                          locale:locale,
                          productFamilies:family
                      },
                    )
                    resolve(data);
                  }
                }).catch(error => {
                  logger.error("Error occured while fetching productFamilies");
                  var data=Object.assign(
                    {},
                    {
                        productFamilies:family
                    },
                  )
                  resolve(data);
                  //reject(response.status(500).send("Internal Server Error! Unable to fetch productFamilies."));
                })
          
                logger.info("End of getproductFamilies function");
              }
        })
      }  
      else{
        console.log(clause);
        temp_db.findAll({
          where:clause,
          attributes: ['id','name'],
        }).then(family => {
          if (null==family) {
            logger.error(" Telugu productFamily not found in the DB");
            reject(response.status(404).send("Unable to fetch productFamilies"));
          }
          else {
            var data=Object.assign(
              {},
              {
                  productFamilies:family
              },
            )
            resolve(data);
          }
        }).catch(error => {
          logger.error("Error occured while fetching productFamilies");
          var data=Object.assign(
            {},
            {
                productFamilies:family
            },
          )
          resolve(data);
          //reject(response.status(500).send("Internal Server Error! Unable to fetch productFamilies."));
        })
  
        logger.info("End of getproductFamilies function");
      }
    }
    catch (err) {
      logger.error("Error occured while fetching productFamilies ::" + err);
      var data=Object.assign(
        {},
        {
            productFamilies:family
        },
      )
      resolve(data);
      //reject(response.status(500).send("Internal Server Error! Unable to fetch productFamilies."));
    }
  })
}


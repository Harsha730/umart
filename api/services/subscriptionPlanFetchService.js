'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const { plan_price, plan, features } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.subscriptionList= function (param,response) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into getPlans function");
 /*      var temp_db;
      if(locale=="te_IN")
      temp_db=db.translated_city
      else
      temp_db=db.plan
 */
      // This function fetches all the countries
     
      db.features.findAll({
      //attributes: ['name'],
            where: {
              is_active: {
                [op.not]: false //Fetching the products with the vendor qr_code
              }
            },
             include:[{
              model:db.plan,
              where: {
                country: {
                  [op.eq]: param //Fetching the products with the vendor qr_code
                }
              },
            }] 
      }).then(result => {
    //    console.log(result)
        if (0 == result.length) {
          logger.error("plans not found in the DB");
          var data=Object.assign(
            {},
            {
              features:[],
              plans:[]
            },
          )
         // reject(response.status(404).send("Unable to fetch plans"));
         resolve(data);
        }
        else {
          //Preparing the Response
          var plans_data;
           const resObj = result.map(feature=> {
             var plans=feature.plans;
             plans_data=plans.map(plan=>{
              return Object.assign(
                {},
                {
                  id:plan.id,
                  name:plan.name,
                  country:plan.country,
                  currency_code:plan.currency_code,
                  price:plan.price, 
             })
            })
      //     console.log(temp_plans);
            return Object.assign(
              {},
              {
                id:feature.id,
                name:feature.name,
                description:feature.description,
                plans:feature.plans.map(plan=>{
                  return Object.assign(
                    {},
                    {
                  id:plan.id,
                  name:plan.name,
                  feature_condition:plan.plan_features.feature_condition
                    })
                })
              });
          });
          var data=Object.assign(
            {},
            {
              features:resObj,
              plans:plans_data
            },
          )
          resolve(data);
        }
      }).catch(error => {
 //       console.log(error);
        logger.error("Error occured while fetching plans:: "+error);
  //      console.log(error)
        reject(response.status(500).send("Internal Server Error! Unable to fetch plans."));
      })

      logger.info("End of getPlans function");
      
    }
    catch (err) {
      logger.error("Error occured while fetching plans ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch plans."));
    }
  })
}


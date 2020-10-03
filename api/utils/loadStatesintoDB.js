'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var vendorUtils = require('./vendorUtil'),
  mailUtil = require('./mailUtil'),  //importing the mail util
  logger = require('../config/winston_Logger'),
  productSku=require('./productUtil');

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the vendor info into the DB 
 to register the vendor*/

exports.loadStates = async function (states) {

  try {

    // Creating and returning the the Promise
    return new Promise(function (resolve, reject) {
      var isError,err;
    logger.info("Entered into loadStates function");

    /** This function loads the products into the DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */

   console.log("creating states::")
   console.log(states);

    db.translated_state.bulkCreate(states,{
      // Check for the duplicate vendor with the provided phone and email
    }).then(function(){
       var product=db.translated_state.findAll();
        isError=false;
        resolve("Loaded states into DB");
    }).catch(function(error){
        isError=true;  
        err=error;
   //     console.log(error);
        console.log('Error during Post: ' + error);
        reject("Failed to load states into DB");
    });
  })
  }
  catch (err) {

    logger.error("Error occured while registering the user ::" + err);

    reject(response.status(500).send("Internal Server Error! Unable to submit your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
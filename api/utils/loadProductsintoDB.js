'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var vendorUtils = require('../utils/vendorUtil'),
  mailUtil = require('../utils/mailUtil'),  //importing the mail util
  logger = require('../config/winston_Logger'),
  productSku=require('../utils/productUtil');

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the vendor info into the DB 
 to register the vendor*/

exports.loadProducts = async function (products) {

  try {

    // Creating and returning the the Promise
    return new Promise(function (resolve, reject) {
    logger.info("Entered into loadProducts function");

    var product_sku=productSku.getSku(),product,isError=false,err;
    /** This function loads the products into the DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */

    db.translated_product.bulkCreate(products,{
      // Check for the duplicate vendor with the provided phone and email
    }).then(function(){
        product=db.products.findAll();
        isError=false;
        resolve("Loaded products into DB");
    }).catch(function(error){
        isError=true;  
        err=error;
        console.log('Error during Post: ' + error);
        reject("Failed to load products into DB");
    });
  })
  }
  catch (err) {

    logger.error("Error occured while registering the user ::" + err);

    reject(response.status(500).send("Internal Server Error! Unable to submit your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
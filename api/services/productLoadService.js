'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var productUtil = require('../utils/productUtil'),
  logger = require('../config/winston_Logger');
const { reject } = require("async");

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the product info into the DB 
 to load the product*/

exports.loadProduct = async function (data, response) {

  try {

    logger.info("Entered into loadProduct function");

    var sku = productUtil.getSku(),
      product = db.products;
  
      var is_include_shipping;
      if(!Boolean(data.price_book_id))
      data.price_book_id=null;

      if(data.is_include_shipping=="false")
       is_include_shipping=false;
      else
       is_include_shipping=true;

      if(!Boolean(data.tags))
      data.tags="";
    /** This function creates the vendor in DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */
   return new Promise(function (resolve, reject) {

   db.products.findOrCreate({
    // Check for the duplicate vendor with the provided phone and email
    where: {
      [op.and]: [{
        name: {
          [op.eq]: data.name
        }
      }, {
        vendor_id: {
          [op.eq]: data.vendor_id
        }
       }]
    }, 
    // Vendor data that needs to be inserted in DB if not already exists 
    defaults: {
        sku: sku,
        name:data.name,
        short_description:data.short_description, 
        long_description:data.long_description,
        price:data.price,
        is_include_shipping : is_include_shipping,
        currency_id:data.currency_id, 
        vendor_id:data.vendor_id,
        quantity:data.quantity,
        product_family_id:data.product_family_id,
        small_image_path:data.small_image_path,
        standard_image_path:data.standard_image_path,
        image_caption:data.image_caption,
        is_active:data.is_active,
        is_deleted:false,
        price_book_id:data.price_book_id,
        tags:data.tags,
        discount_price:data.discount_price
    }
  }).then(status=>{
    if (status[1]) {
        // Sending the confirmation mail to the vendor
        logger.info("product inserted successfully");
        resolve("Product has been successfully added to your outlet.");
       /*  var utilityService=require('../services/utilityService');
        utilityService.getData(data.vendor_id,response).then(data=>{
            //Returning the Data
            resolve(data);
        },error=>{
            error;
        }) */
      }
      else {
          logger.error("product already exists with the provided info ::name/vendor_id ::");
          reject(response.status(409).send("A Product already registered with these details, Please change your product name to add."));
      }
  },error=>{
    logger.error("Internal server error ::"+error);
    reject(response.status(404).send("Unable to Add your product as vendor not found with the provided info."));
  });
  
 // console.log(created);

        logger.info("End of load product function");
      });

  //Returning the success or failed transaction as promise
  

/* return new Promise(function (resolve, reject) {

    product.create({
        sku: sku,
        name:data.name,
        short_description:data.short_description, 
        long_description:data.long_description,
        price:data.price,
        currency_id:data.currency_id, 
        vendor_id:data.vendor_id,
        quantity:data.quantity,
        product_family_id:data.product_family_id,
        small_image_path:data.small_image_path,
        standard_image_path:data.standard_image_path,
        image_caption:data.image_caption,
        is_active:data.is_active,
        is_deleted:false
    }).then(result=>{
       // Sending the confirmation mail to the vendor
       logger.info("product inserted successfully");
       resolve("Product has been successfully added to your outlet. Thank you for your business.");
    },error=>{
        logger.error("vendor already exists with the provided info ::phone/email");
        reject(response.status(409).send("A Product already registered with these details, change your phone or email for new registration or please reach our support team at Contact Us. Thank you for your business."));
    });

    logger.info("End of load product function");

}); */

  }

  catch (err) {

    logger.error("Error occured while loading the product " + err);

    reject(response.status(500).send("Internal Server Error! Unable to add your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
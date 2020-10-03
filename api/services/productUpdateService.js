'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');
const { products } = require('../models/sequelize');
const db = require("../models/sequelize"),
   op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor profile in the DB
 based qrCode*/

exports.update_product= function (sku,name,short_description,long_description,price,currency_id,vendor_id,quantity,product_family_id,small_image_path,standard_image_path,image_caption,is_active, is_include_shipping,tags,price_book_id,discount_price,response) {

   // Creating and returning the Promise

   return new Promise(function (resolve, reject) {

      try {

        var isDuplicate=false;

        if(Boolean(tags))
        tags=tags.join(",");
        else
        tags="";

        if(!Boolean(price_book_id))
        price_book_id=null;

        logger.info('Entered into the update_product service');

        db.products.findAll({
           where: {           
                name: {
                  [op.eq]: name
                },
           vendor_id:{
                 [op.eq]: vendor_id
                },
                [op.and]:[{
                    sku:{
                   [op.not]:sku
                    }
                }]
            },
        }).then(products=>{
           if(products.length!=0)
            isDuplicate=true
            if(!isDuplicate) {
              // This function fetches single vendor from DB
             // This function fetches single vendor from DB
             db.products.findOne({
                // Check for vendor by qrCode
                where: { sku: sku },
             }).then((product) => {
                if (null != product) {
                   logger.info("Found the product to update");
                   // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
                   product.update({name:name,short_description:short_description,long_description:long_description,price:price,currency_id:currency_id,vendor_id:vendor_id,quantity:quantity,product_family_id:product_family_id,small_image_path:small_image_path,standard_image_path:standard_image_path,image_caption:image_caption,is_active:is_active,is_include_shipping : is_include_shipping,tags:tags,price_book_id:price_book_id,discount_price:discount_price}).then(status=>{
                   resolve("Product updates submitted successfully!.");
                   });
                } else {
                   logger.error("product not found in the DB with the sku #" + sku);
                   reject(response.status(404).send("Unable to update product as no product matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
                }
             }).catch(error => {
                logger.error("Error occured::" + error);
                reject(response.status(500).send("Internal Server Error! Unable to update your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
             });
           }
           else{
              logger.error("A Product Already exists with the same details ::"+name);
              reject(response.status(409).send("A Product already registered with these details, Please change your product name to update."));
           }
        });              
         logger.info('End of update_product service');
      }
      catch (err) {
         logger.error("Error occured while updating the product data ::" + err)
         reject(response.status(500).send("Internal Server Error! Unable to update your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      }
   })
}

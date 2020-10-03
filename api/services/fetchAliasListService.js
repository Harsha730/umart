'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { cities } = require("../controllers/vendorController");
const { vendorAlias, vendor } = require("../models/sequelize");
const { vendor_alias_verify } = require("./vendorAliasVerifyService");

logger = logger(module) // Passing the module to the logger

exports.getAliasList = function (id,res) {
  try {
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getAliasList");
     /*  var clause;
      if("true"==status)
      clause={user_status:"true"};
      else if("false"==status)
      clause={user_status:"false"};
      else
      clause=undefined; */
      db.vendor.findOne({
        where:{qr_code : id},
         include: [
        // Including all the required modules for the response
          {
            model : db.vendorAlias,
          },
        ] 
      }
      ).then(vendor => {
        var resObj;
        if(null!=vendor) {
        resObj = Object.assign(
                {},
                {
                aliases: vendor.vendor_aliases.map(vendor_alias => {

                  if(Boolean(vendor_alias.payment_method))
                  vendor_alias.payment_method=vendor_alias.payment_method.split(",");
                  else
                  vendor_alias.payment_method=[];
                  var temp_phone="+"+vendor_alias.phone,temp_email=vendor_alias.email;
                  if("Yes"==vendor_alias.privacy_mode){
                    temp_phone="";
                    temp_email="";
                  }
                  return Object.assign(
                    {},
                    {
                      qr_code:vendor_alias.qr_code,
                      name:vendor_alias.name,
                      email : temp_email,
                      phone: temp_phone,
                      is_approved:vendor_alias.is_approved,
                      submitted_date :vendor_alias.submitted_date,
                      created_by:vendor_alias.created_by,
                      updated_date:vendor_alias.updated_date,
                      updated_by:vendor_alias.updated_by,
                      is_admin:vendor_alias.is_admin,
                      is_outlet_display:vendor_alias.is_outlet_display,
                      is_payment_contact:vendor_alias.is_payment_contact,
                      is_phone_verified:vendor_alias.is_phone_verified,
                      privacy_mode:vendor_alias.privacy_mode,
                      payment_method:vendor_alias.payment_method
                    });
                }),
            });
        }
        if (null==vendor) {
            resObj = Object.assign(
                {},
                {
                aliases:[]
                });
  //logger.error("Vendor not found in the DB with the info #" + id);
          resolve(resObj);
        }
        else {
          logger.info("Found the vendor getAliasList ::" + id);
          resolve(resObj);
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch getAliasList. Thank you for your business."));
      }))
    })// end of try
  }
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch AliasList. Thank you for your business."));
  }
}
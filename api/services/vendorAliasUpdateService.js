'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');
const { loadPriceBook } = require('./priceBookLoadService');
const db = require("../models/sequelize"),
   op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor profile in the DB
 based qrCode*/

exports.update_vendor_alias = function (qrCode,name,email,phone,updatedDate,isApproved,comments, is_admin,is_outlet_display,is_payment_contact,updated_by,privacy_mode,response) {

   // Creating and returning the Promise

   return new Promise(function (resolve, reject) {

      try {

      var isDuplicate = false;
      if(is_admin=="true")
      is_admin=true;
      else
      is_admin=false;
      if(is_outlet_display=="true")
      is_outlet_display=true;
      else
      is_outlet_display=false;
      if(is_payment_contact=="true")
      is_payment_contact=true;
      else
      is_payment_contact=false;

      if("no"==privacy_mode)
      privacy_mode="No"
      else
      privacy_mode="Yes";

         logger.info('Entered into the update_vendor_alias service');

         db.vendor.findOne({
            where: {
               [op.or]: [{
                  email: {
                     [op.eq]: email
                  }
               }, {
                  phone: {
                     [op.eq]: phone
                  }
               }
               ]}
         }).then(tempVendor=>{
            if(null==tempVendor){
               db.vendorAlias.findAll({
                  where: {
                     [op.or]: [{
                        email: {
                           [op.eq]: email
                        }
                     }, {
                        phone: {
                           [op.eq]: phone
                        }
                     }
                     ],
                     [op.and]: [{
                        qr_code: {
                           [op.not]: qrCode
                        }
                     }]
                  },
               }).then(vendors => {
                  if (vendors.length!=0)
                     isDuplicate = true
                  if (!isDuplicate) {
                     // This function fetches single vendor from DB
                     db.vendorAlias.findOne({
                        // Check for vendor by qrCode
                        where: { qr_code: qrCode },
                     }).then((vendor) => {
                        if (null != vendor) {
                           logger.info("Found the vendor alias to update");
                           logger.info("Alias profile updated successfully by "+updated_by+" on "+new Date());
                           // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
                           vendor.update({name: name,updated_date: updatedDate, phone: phone, email: email, is_approved: isApproved, comments: comments,is_admin:is_admin,is_outlet_display:is_outlet_display,is_payment_contact:is_payment_contact,updated_by:updated_by,privacy_mode:privacy_mode}).then(status => {
                              db.vendorAlias.findOne({
                                 where: { qr_code: qrCode }
                              }
                              ).then(vendor_alias => {
                                 var temp_phone="+"+vendor_alias.phone;
                                vendor = Object.assign(
                                    {},
                                    {
                                       qr_code:vendor_alias.qr_code,
                                       name:vendor_alias.name,
                                       email : vendor_alias.email,
                                       phone:temp_phone,
                                       is_approved:vendor_alias.is_approved,
                                       submitted_date :vendor_alias.submitted_date,
                                       created_by:vendor_alias.created_by,
                                       updated_date:vendor_alias.updated_date,
                                       updated_by:vendor_alias.updated_by,
                                       is_admin:vendor_alias.is_admin,
                                       is_outlet_display:vendor_alias.is_outlet_display,
                                       is_payment_contact:vendor_alias.is_payment_contact,
                                       is_phone_verified:vendor_alias.is_phone_verified,
                                       privacy_mode:vendor_alias.privacy_mode
                                    }),
      
                                    resolve(vendor);
                              });
      
                           });
                        } else {
                           logger.error("vendor not found in the DB with the qrCode #" + qrCode);
                           reject(response.status(404).send("Unable to update alias profile as no profile matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
                        }
                     }).catch(error => {
                        logger.error("Error occured::" + error);
                        reject(response.status(500).send("Internal Server Error! Unable to update alias profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
                     });
                  }
                  else {
                     logger.error("vendor already exists with the provided info ::phone/email" + phone + "/" + email);
                     reject(response.status(409).send("Another alias already exists with this email/phone. If you have not given them, please contact site admin else update with another email ID or phone number."));
                  }
               });
               logger.info('End of update_vendor service');
            }else{
               logger.error("vendor already exists with the provided info ::phone/email" + phone + "/" + email);
               reject(response.status(409).send("Another vendor already exists with this email/phone. If you have not given them, please contact site admin else update with another email ID or phone number."));
            }
         })
      }
      catch (err) {
         logger.error("Error occured while updating the vendor data ::" + err)
         reject(response.status(500).send("Internal Server Error! Unable to update your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      }
   })
}
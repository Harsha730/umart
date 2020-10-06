'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'), otpUtil = require('../utils/otpUtil'), mailUtil = require('../utils/aliasEmailVerification'), phoneUtil = require('../utils/phoneUtil');
const { translated_vendor } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor alias secret_key, timestamp to verify the vendor alias in the DB 
 based on email*/
exports.vendor_alias_verify = function (id, response, isPhone) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info('Entered into the vendor_alias_verify service');

      // Generating the OTP
      var otp = otpUtil.generateSecret(), clause, phone;

      // Condition based clauses for mail and mobile verification
      if (isPhone) {
        clause = {
          [op.or]: [{
            phone: {
              [op.eq]: 91 + id     // Adding country code to mobile number for searching
            }
          }, {
            phone: {
              [op.eq]: 1 + id       // Adding country code to mobile number for searching
            }
          }
          ]
        }
      }
      else {
        clause = { email: id }
      }

      // This function fetches the single vendor from the DB
      db.vendorAlias.findOne({
        // Specifying the columns required for the SELECT Query! 
        attributes: ['qr_code', 'phone', 'is_admin', 'timestamp', 'secret_key'],
        // fetching vendor based on email
        where: clause,
      }).then(vendor => {
        if (null == vendor) {
          logger.error("Unable to send OTP as vendor / executor not found with the mail/ phone #" + id);
          reject(response.status(404).send("Unable to send verification code as this profile is not registered. Please register your profile. Thank you for your business."));
        }
        else if (true != vendor.is_admin) {
          logger.error("Unable to send OTP as vendor alias is not have admin previliges #" + id);
          reject(response.status(404).send("Unable to send verification code as this profile don't have admin previlige. Please grant admin previliges to this alias profile. Thank you for your business."));
        }
        else {
          phone = "+" + vendor.phone;
          logger.info("found the executive to update");
          //console.log(vendor.vendor_aliases);
          // Updating the vendor with the latest timestamp and OTP
          vendor.update({ timestamp: Date.now(), secret_key: otp });
          if (isPhone) {
            // Sending the OTP to vendor phone
            phoneUtil.sendOTP(phone, otp);
            resolve("Verification code successfully sent to registered mobile. Thank you for your business.");
          } else {
            // Sending the OTP to vendor mail
            mailUtil.aliasEmailVerification(id,otp);
            logger.info("OTP sent successfully");
            resolve("Verification code successfully sent to registered email. Thank you for your business.");
          }
        }
      }).catch(error => {
        logger.error("Error occured while update the vendor ::" + error);
        reject(response.status(500).send("Internal Server Error! Unable to send verification code. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    }
    catch (err) {
      logger.error("Error occured while update the vendor ::" + error);
      reject(response.status(500).send("Internal Server Error! Unable to send verification code. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  })
}

exports.verify_vendor_alias = function (id, otp, isPhone, locale, response) {

  // Creating  and returning the Promise
  return new Promise(function (resolve, reject) {

    try {

      logger.info('Entered into the verify_vendor service');

      var clause;

      // Condition based clauses for mail or mobile verification
      if (isPhone) {
        clause = {
          [op.or]: [{
            phone: {
              [op.eq]: 91 + id    // Adding country code to mobile number for searching
            }
          }, {
            phone: {
              [op.eq]: 1 + id    // Adding country code to mobile number for searching
            }
          }
          ]
        }
      }
      else {
        clause = { email: id }
      }
      if (locale == "te_IN") {
        db.vendor.findOne({
          where: clause,
        }).then(vendor => {
          if (vendor == null || vendor == undefined) {
            logger.error("Executor not found in the DB with the info #" + id);
            reject(response.status(404).json("Unable to fetch your vendor profile as no profile matching with your data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
          }
          else {
            // OTP Verification logic
            var timestamp = vendor.timestamp, secret_key = vendor.secret_key,

              status = false,

              timeDiff = (Date.now() - timestamp) / 1000 / 60; // This gives time difference in Mins

            // If time difference is more than 10 Mins, then consider that OTP as invalid
            if (timeDiff <= 10 && secret_key == otp)

              status = true;

            // Returning the vendor outlet if the OTP is valid
            if (status == true) {
              logger.info("Found the vendor outlet ::" + id);
              vendor.timestamp = undefined, vendor.secret_key = undefined;
              db.translated_vendor.findOne({
                where: clause,
                include: [{
                  model: db.translated_state,
                  attributes: [['state_id', 'id'], 'name', 'country_id'],
                }, {
                  model: db.translated_country,
                  attributes: ['id', 'name', 'code'],
                },
                {
                  model: db.translated_city,
                  attributes: [['city_id', 'id'], 'name', 'state_id'],
                }]
              }).then(vendor => {
                if (null == vendor) {
                  logger.error("vendor not found in the DB with the info ::" + id);
                  reject(response.status(404).send("Unable to fetch your profile in Telugu. Thank you for your business."));
                }
                else {
                  var data = JSON.stringify(vendor),
                    vendor_data = JSON.parse(data);
                  vendor_data.category = vendor_data.category.split(",");
                  vendor_data.language = vendor_data.language.split(",");
                  if (vendor_data.is_approved == 1)
                    vendor_data.is_approved = true;
                  else
                    vendor_data.is_approved = false;
                  if (null == vendor.short_name)
                    vendor.short_name = "";
                  var country_name, state_name, city_name;
                  country_name = vendor_data.translated_country,
                    state_name = vendor_data.translated_state,
                    city_name = vendor_data.translated_city;
                  logger.info("Found vendor");
                  vendor_data = Object.assign(
                    {},
                    {
                      qrCode: vendor_data.qr_code,
                      company_name: vendor_data.company_name,
                      name: vendor_data.name,
                      email: vendor_data.email,
                      categories: vendor_data.category,
                      phone: vendor_data.phone,
                      company_address: vendor_data.company_address,
                      country: country_name,
                      state: state_name,
                      city: city_name,
                      zip: vendor_data.zip_code,
                      languagesPreferred: vendor_data.language,
                      submittedDate: vendor_data.submitted_date,
                      updatedDate: vendor_data.updated_date,
                      short_name: vendor_data.short_name,
                      site: vendor_data.site,
                      isApproved: vendor_data.is_approved,
                      logo: vendor_data.logo,
                      show_logo: vendor_data.show_logo,
                      /*   comments: vendor_data.comments,
                        token: vendor_data.token,
                        secret_key: vendor_data.secret_key,
                        timestamp: vendor_data.timestamp, */
                      //  description: vendor_data.description,
                      //  story: vendor_data.story,

                    }
                  )
                  resolve(vendor_data);
                }
              }).catch(error => {
                console.log(error);
                logger.error("Error occured while fetching the vendor ::" + id);
                reject(response.status(500).send("Internal Server Error! Unable to fetch your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
              })
            }
            else {
              logger.error("User entered invalid OTP");
              reject(response.status(401).send("OTP entered is invalid and or expired. Please request for the new OTP."));
            }
          }
        }, (error => {
          logger.error("Error occured ::" + error);
          reject(response.status(500).send("Internal Server Error! Unable to fetch your Profile. Thank you for your business."));
        }))
      }
      else {
        // This function fetches the single vendor with the matched email
        db.vendorAlias.findOne({
          where: clause
        }
        ).then(vendor => {
          var phone;
          phone = "+" + vendor.phone;
          if (vendor == null || vendor == undefined) {
            logger.error("Vendor alias not found in the DB with the info #" + id);
            reject(response.status(404).json("Unable to verify the profile as no profile matching with your data. Thank you for your business."));
          }
          else {
            // OTP Verification logic
            var timestamp = vendor.timestamp, secret_key = vendor.secret_key,

              status = false,

              timeDiff = (Date.now() - timestamp) / 1000 / 60; // This gives time difference in Mins

            // If time difference is more than 10 Mins, then consider that OTP as invalid
            if (timeDiff <= 10 && secret_key == otp)

              status = true;

            // Returning the vendor outlet if the OTP is valid
            if (status == true) {
              logger.info("Found the vendor-alias outlet ::" + id);
              if(isPhone){
                vendor.update({is_phone_verified:true}).then(tempStatus=>{
                  if(vendor.payment_method)
                  vendor.payment_method=vendor.payment_method.split(",");
                  else
                  vendor.payment_method=[];
                  var vendor_alias=vendor,
                      temp_phone=+vendor.phone,
                  data= Object.assign(
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
                      is_phone_verified:true,
                      privacy_mode:vendor_alias.privacy_mode,
                      payment_method:vendor.payment_method
                    });
                 // resolve("Alias phone number verified successfully. This phone number can be used to login");
                    resolve(data);
                })
              }else{
                vendor.update({is_email_verified:true}).then(tempStatus=>{
                  resolve("Alias email verified successfully. This email can be used to login");
                })
              }
            }
            else {
              logger.error("User entered invalid OTP");
              reject(response.status(401).send("Verification code entered is invalid and or expired. Please request for the new verification code."));
            }
          }
        }, (error => {
          logger.error("Error occured ::" + error);
          reject(response.status(500).send("Internal Server Error! Unable to verify the profile. Thank you for your business."));
        }))
      }
    }
    catch (error) {
      logger.error("Error occured while verifying the vendor-alias ::" + error);
      reject(response.status(500).send("Internal Server Error! Unable to verify the profile. Thank you for your business."));
    }
  });
}

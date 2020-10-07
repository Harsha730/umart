'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'), otpUtil = require('../utils/otpUtil'), mailUtil = require('../utils/mailUtil'), phoneUtil = require('../utils/phoneUtil');
const { translated_vendor } = require('../models/sequelize');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor secret_key, timestamp for every OTP request in the DB 
 based on email*/
exports.update_vendor = function (id,response, isPhone) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info('Entered into the update_vendor service');

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
      db.vendor.findOne({
        // Specifying the columns required for the SELECT Query! 
        attributes: ['qr_code', 'phone', 'timestamp', 'secret_key'],
        // fetching vendor based on email
        where: clause,
        include:[{
          model:db.vendor_plan
        }]
      }).then(vendor => {
        if (null == vendor) {
              db.vendorAlias.findOne({
                where: clause,
                include:[{
                  model:db.vendor
                }]
              }).then(alias => {
                if (null == alias) {
                  logger.error("Unable to send OTP as vendor / executor not found with the mail/ phone #" + id);
                  reject(response.status(404).send("Unable to send OTP as your profile is not registered. Please register your profile. Thank you for your business."));
                }
                else if(true!=alias.is_admin){
                      logger.error("Vendor Alias is not admin to login #" + id);
                    reject(response.status(401).json("You are not authorized to login. Thank you for your business."));
                }
                else if(isPhone && !alias.is_phone_verified){
                  logger.error("Vendor Alias phone is not verified to login #" + id);
                  reject(response.status(401).json("Your phone number is not verified. Please verify to login. Thank you for your business."));
                }
                /* else if(!isPhone && !vendor.is_email_verified){
                  logger.error("Vendor Alias phone is not verified to login #" + id);
                  reject(response.status(401).json("Your email is not verified. Please verify to login. Thank you for your business."));
                } */
                else {
                  db.vendor_plan.findOne({
                    attributes: ["is_active", "end_date"],
                    where: {vendor_id:alias.vendor.qr_code}
                  }).then(vendor_plan=>{
                    var dateDiff;
                    if(null==vendor_plan)
                    dateDiff=0;
                    else{
                      var currentDate=new Date(),
                      end_date=new Date(vendor_plan.end_date),
                      dateDiff=currentDate.getTime()-end_date.getTime();
                    }
                    var is_active=false;
                    if(null!=vendor_plan)
                    is_active=vendor_plan.is_active;
                    if(null==vendor_plan||(true==is_active&&0>=dateDiff)){
                  phone = "+" + alias.phone;
                  logger.info("found the executive to update");
                  //console.log(vendor.vendor_aliases);
                  // Updating the vendor with the latest timestamp and OTP
                  alias.update({ timestamp: Date.now(), secret_key: otp });
                  if (isPhone) {
                    // Sending the OTP to vendor phone
                    phoneUtil.sendOTP(phone, otp);
                    resolve("OTP successfully sent to your registered mobile. Thank you for your business.");
                  } else {
                    // Sending the OTP to vendor mail
                    mailUtil.sendMail(id, "", "", "", "", "", false, true, otp);
                    logger.info("OTP sent successfully");
                    resolve("OTP successfully sent to your registered email . Thank you for your business.");
                  }
                } else if(null!=vendor_plan&&(0<dateDiff||false==is_active)){
                  logger.error("Vendor Plan Expired");
                  reject(response.status(403).json("Your account is not active. It is either expired/disabled and or not activated yet. Please reach out to umart44 admin to enable or renew your web services. Thank you for your business."));
                }
                })
              }
              }).catch(error => {
                logger.error("Error occured while update the vendor ::" + error);
                reject(response.status(500).send("Internal Server Error! Unable to send OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
              });
         //   }
         // })
        }
        else {
          var qr_code=vendor.qr_code;
          db.vendor_plan.findOne({
            attributes: ["is_active", "end_date"],
            where: {vendor_id:qr_code}
          }).then(vendor_plan=>{
            var dateDiff;
            if(null==vendor_plan)
            dateDiff=0;
            else{
              var currentDate=new Date(),
              end_date=new Date(vendor.vendor_plan.end_date),
              dateDiff=currentDate.getTime()-end_date.getTime();
            }
            var is_active=false;
            if(null!=vendor_plan)
            is_active=vendor_plan.is_active;
            if(null==vendor_plan||(true==is_active&&0>=dateDiff)){
          phone = "+" + vendor.phone;
          logger.info("found the vendor to update");
          // Updating the vendor with the latest timestamp and OTP
          vendor.update({ timestamp: Date.now(), secret_key: otp });
          if (isPhone) {
            // Sending the OTP to vendor phone
            phoneUtil.sendOTP(phone, otp);
            resolve("OTP successfully sent to your registered mobile. Thank you for your business.");
          } else {
            // Sending the OTP to vendor mail
            mailUtil.sendMail(id, "", "", "", "", "", false, true, otp);
            logger.info("OTP sent successfully");
            resolve("OTP successfully sent to your registered email . Thank you for your business.");
          }
        }
        else if(null!=vendor_plan&&(0<dateDiff||false==is_active)){
          logger.error("Vendor Plan Expired");
          reject(response.status(403).json("Your account is not active. It is either expired/disabled and or not activated yet. Please reach out to umart44 admin to enable or renew your web services. Thank you for your business."));
        }
      })
    }
      }).catch(error => {
        logger.error("Error occured while update the vendor ::" + error);
        reject(response.status(500).send("Internal Server Error! Unable to send OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    }
    catch (err) {
      logger.error("Error occured while update the vendor ::" + error);
      reject(response.status(500).send("Internal Server Error! Unable to send OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  })
}

exports.verify_vendor = function (id, otp, isPhone, locale, response) {

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
                  attributes: [['state_id','id'],'name','country_id'],
                }, {
                  model: db.translated_country,
                  attributes: ['id','name','code'],
                },
                {
                  model: db.translated_city,
                  attributes: [['city_id','id'],'name','state_id'],
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
                      logo:vendor_data.logo,
                      show_logo:vendor_data.show_logo,
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
             //   console.log(error);
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
        db.vendor.findOne({
          where: clause,
          include: [
            {
              model: db.state
            }, {
              model: db.country
            },
            {
              model: db.city
            },
            {
              model:db.priceBook,
              include:[
                {
                  model:db.gst_slabs
                }
              ]
            },
            {
              model:db.vendor_plan,
              include:[{
                model:db.plan
              }]
            }
          ]
        }
        ).then(vendor => {
          var phone;
        //  console.log("in Vendor");
       //   console.log(vendor)
          if(null!=vendor){
            if(null!=vendor.vendor_plan&&""==vendor.vendor_plan.payment_updated_date)
            vendor.vendor_plan.payment_updated_date="trail-period";
          phone = "+" + vendor.phone;
          /* if (vendor.short_name == null)
          vendor.short_name = undefined; */
          vendor.city.country_id = undefined;
          if (vendor.logo == null)
            vendor.logo = "";
          if (vendor.show_logo == null)
            vendor.show_logo = false;
          vendor = Object.assign(
            {},
            {
              qrCode: vendor.qr_code,
              company_name: vendor.company_name,
              short_name: vendor.short_name,
              name: vendor.name,
              email: vendor.email,
              categories: vendor.category.split(","),
              phone: vendor.phone,
              company_address: vendor.company_address,
              country: vendor.country,
              state: vendor.state,
              city: vendor.city,
              zipcode: vendor.zip_code,
              languagesPreferred: vendor.language.split(","),
              submittedDate: vendor.submitted_date,
              updatedDate: vendor.updated_date,
              site: vendor.site,
              isApproved: vendor.is_approved,
              timestamp: vendor.timestamp,
              secret_key: vendor.secret_key,
              logo: vendor.logo,
              show_logo: vendor.show_logo,
              price_book:vendor.price_book,
              role:"super-admin",
              plan:vendor.vendor_plan
            },
          )
          }
          if (vendor == null || vendor == undefined) {
        //    console.log("in Vendor Alias")
            // This function fetches the single vendor with the matched email
            db.vendor.findOne({
              // Including all the required models for the response
              include: [
                {
                  model: db.vendorAlias,
                  where: clause,
                },
                {
                  model: db.state
                }, {
                  model: db.country
                },
                {
                  model: db.city
                },
                {
                  model:db.priceBook,
                  include:[
                    {
                      model:db.gst_slabs
                    }
                  ]
                },
                {
                  model:db.vendor_plan
                }
              ]
            }
            ).then(vendor => {
      //      console.log("In Vendor Alias")
              var phone,resObj;
     //         console.log(JSON.parse(JSON.stringify(vendor)))
              if(vendor!=null){
                if(null!=vendor.vendor_plan&&""==vendor.vendor_plan.payment_updated_date)
            vendor.vendor_plan.payment_updated_date="trail-period";
                var admin_name="";
              if(null!=vendor.vendor_aliases&&0!=vendor.vendor_aliases.length)
              admin_name=vendor.vendor_aliases[0].name;
              phone = "+" + vendor.phone;
             /*  if (vendor.short_name == null)
                vendor.short_name = undefined; */
              vendor.city.country_id = undefined;
              if (vendor.logo == null)
                vendor.logo = "";
              if (vendor.show_logo == null)
                vendor.show_logo = false;
                resObj = Object.assign(
                {},
                {
                  admin_name:admin_name,
                  qrCode: vendor.qr_code,
                  company_name: vendor.company_name,
                  short_name: vendor.short_name,
                  name: vendor.name,
                  email: vendor.email,
                  categories: vendor.category.split(","),
                  phone: vendor.phone,
                  company_address: vendor.company_address,
                  country: vendor.country,
                  state: vendor.state,
                  city: vendor.city,
                  zipcode: vendor.zip_code,
                  languagesPreferred: vendor.language.split(","),
                  submittedDate: vendor.submitted_date,
                  updatedDate: vendor.updated_date,
                  site: vendor.site,
                  isApproved: vendor.is_approved,
                  timestamp: vendor.timestamp,
                  secret_key: vendor.secret_key,
                  logo: vendor.logo,
                  show_logo: vendor.show_logo,
                  price_book:vendor.price_book,
                  role:"admin",
                  plan:vendor.vendor_plan
                },
              )
              }
              if (vendor == null || vendor == undefined) {
                logger.error("Executor not found in the DB with the info #" + id);
                reject(response.status(404).json("Unable to fetch your vendor profile as no profile matching with your data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
              }
              else {

       //         console.log(vendor.vendor_aliases);

        //        console.log(JSON.parse(JSON.stringify(vendor)));

                // OTP Verification logic
                var timestamp = vendor.vendor_aliases[0].timestamp, secret_key = vendor.vendor_aliases[0].secret_key,

                  status = false,

                  timeDiff = (Date.now() - timestamp) / 1000 / 60; // This gives time difference in Mins

                // If time difference is more than 10 Mins, then consider that OTP as invalid
                if (timeDiff <= 10 && secret_key == otp)

                  status = true;

                // Returning the vendor outlet if the OTP is valid
                if (status == true) {
                  logger.info("Found the vendor outlet ::" + id);
                  vendor.timestamp = undefined, vendor.secret_key = undefined; //vendorAlias = undefined;
                  resolve(resObj);
                }
                else {
                  logger.error("User entered invalid OTP");
                  reject(response.status(401).send("OTP entered is invalid and or expired. Please request for the new OTP."));
                }
              }
            }, (error => {
              logger.error("Error occured ::" + error);
              reject(response.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
            }))
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
              resolve(vendor);
            }
            else {
              logger.error("User entered invalid OTP");
              reject(response.status(401).send("OTP entered is invalid and or expired. Please request for the new OTP."));
            }
          }
        }, (error => {
          logger.error("Error occured ::" + error);
          reject(response.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
        }))
      }
    }
    catch (error) {
      logger.error("Error occured while verifying the vendor ::" + error);
      reject(response.status(500).send("Internal Server Error! Unable to verify OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  });
}

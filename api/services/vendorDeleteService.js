'use strict'

// importing the required modules
var logger = require('../config/winston_Logger');
const db = require("../models/sequelize"),
   op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to soft deleting (is_approved=false) the existing vendor profile in the DB.
 based on qrCode or Phone or email*/
exports.delete_vendor = function (id, comments, response) {

   logger.info('Entered into the delete_vendor service');

   // Creating  and returning the Promise

   return new Promise(function (resolve, reject) {

      try {

         // This function fetches the single vendor from the DB.
         db.vendor.findOne({
            // check for vendor by qrCode or email or phone
            where: {
               [op.or]: [{
                  email: {
                     [op.eq]: id
                  }
               }, {
                  phone: {
                     [op.eq]: id
                  }
               }, {
                  qr_code: {
                     [op.eq]: id
                  }
               }
               ]
            }
         }).then((vendor) => {
            if (null != vendor) {
               logger.info("Found the vendor to delete (Disable)");
               // Passing the single JSON object with the updated fields. Here keys are DB columns and values are data to be updated.
               vendor.update({ is_approved: false, comments: comments });
               resolve("Vendor profile deleted successfully. Thank you for your business");
            } else {
               logger.error("Vendor not found in the DB with the info #" + id);
               reject(response.status(404).send("Unable to delete vendor profile as no data found. Thank you for your business."));
            }
         }).catch(error => {
            logger.error("Error occured while deleting the vendor ::" + error);
            reject(response.status(500).send("Internal Server Error! Unable to delete vendor profile. Thank you for your business."));
         });
      }
      catch (err) {
         logger.error("Error occured while Deleting the vendor profile ::" + err)
         reject(response.status(500).send("Internal Server Error! Unable to delete vendor profile. Thank you for your business."));
      }
   })
}

/* This service contains the logic, to hard-delete the existing vendor info in the DB :
 based on qrCode or Phone or email */
exports.hard_vendor_delete = function (id, userInfo, response) {

   logger.info('Entered into the delete_vendor service');

   // Importing the security util module
   var securityUtils = require('../utils/securityUtil');

   // Creating  and returning the Promise
   return new Promise(function (resolve, reject) {

      try {

         var uName = userInfo.user, pwd = userInfo.password, isAuthorized = false;

         var fs = require("fs");

         // Authorizing the user for delete action by reading the user data from the users.json file
         fs.readFile('users.json', 'utf8', function (error, data) {

            if (error) {

               logger.error("Error occured while reading users.json file to Authorize::" + error)

               reject(response.status(500).send("Internal Server Error! Unable to Authorize your information. Thank you for your business"));

            }

            else {

               // Check on file Data
               if (Boolean(data)) {

                  var userData = JSON.parse(data);

                  var usersList = userData.users;

                  // Iterating the Users Data

                  usersList.forEach(user => {

                     // decrypting the existing users info
                     var userName = securityUtils.decrypt(user.name, user.token),
                        password = securityUtils.decrypt(user.password, user.token);

                     if (userName == uName && password == pwd)
                        isAuthorized = true;
                  })

                  // Deleting the vendor from the DB if the user is Authorized
                  if (isAuthorized) {
                     db.vendor.destroy({
                        where: {
                           [op.or]: [{
                              email: {
                                 [op.eq]: id
                              }
                           }, {
                              phone: {
                                 [op.eq]: id
                              }
                           }, {
                              qr_code: {
                                 [op.eq]: id
                              }
                           }
                           ]
                        }
                     }).then(status => {
                        if (status == 1)
                           resolve("Vendor profile deleted successfully. Thank you for your business.");
                        else {
                           logger.error("Vendor not found in the DB with the info #" + id);
                           reject(response.status(404).send("Unable to delete vendor profile as no data found. Thank you for your business."));
                        }
                     }).catch(error => {
                        logger.error("Error occured while reading the file to delete the vendor ::" + error)
                        reject(response.status(500).send("Internal Server Error! Unable to delete vendor profile. Thank you for your business."));
                     })
                  }
                  else {
                     logger.error("User is not Authorized to perform delete action ::" + uName);
                     reject(response.status(401).send("You are not authorized to perform this action. Thanks for your business."));
                  }
               }
            }
         });
         logger.info('Entered into the delete_vendor service');
      }
      catch (err) {
         logger.error("Error occured while Deleting the vendor data ::" + err)
         reject(response.status(500).send("Internal Server Error! Unable to delete vendor information. Thank You for your business."));
      }
   })
}
'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');
const db = require("../models/sequelize"),
   op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor profile in the DB
 based qrCode*/

exports.update_vendor = function (qrCode, company_name, name, email, categories, phone, company_address, country, state, city, zipcode, languagesPreferred, updatedDate, site, isApproved, comments,price_book_id,response) {

   // Creating and returning the Promise

   return new Promise(function (resolve, reject) {

      try {

         var isDuplicate = false;

         logger.info('Entered into the update_vendor service');

         db.vendorAlias.findOne({
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
         }).then(tempAlias=>{
            if(null==tempAlias){
               db.vendor.findAll({
                  where: {
                     [op.or]: [{
                        email: {
                           [op.eq]: email
                        }
                     }, {
                        phone: {
                           [op.eq]: phone
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
                  console.log(vendors.length)
                  if (vendors.length != 0)
                     isDuplicate = true
                  if (!isDuplicate) {
                     // This function fetches single vendor from DB
                     db.vendor.findOne({
                        // Check for vendor by qrCode
                        where: { qr_code: qrCode },
                     }).then((vendor) => {
                        if (null != vendor) {
                           logger.info("Found the vendor to update");
                           // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
                           vendor.update({ company_name: company_name, name: name, category: categories.join(","), company_address: company_address, country_id: country, state_id: state, city_id: city, zip_code: zipcode, language: languagesPreferred.join(","), updated_date: updatedDate, phone: phone, email: email, is_approved: isApproved, comments: comments, site: site,price_book_id:price_book_id }).then(status => {
                              db.vendor.findOne({
                                 where: { qr_code: qrCode },
                                 include: [
                                    {
                                       model: db.country
                                    },
                                    {
                                       model: db.state
                                    },
                                    {
                                       model: db.city
                                    },
                                    {
                                       model:db.priceBook,
                                       include:[{
                                         model:db.gst_slabs
                                       }]
                                     }
                                 ]
                              }
                              ).then(vendor => {
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
                                       description: vendor.description,
                                       story: vendor.story,
                                       logo: vendor.logo,
                                       show_logo: vendor.show_logo,
                                       price_book:vendor.price_book,
                                       role:"super-admin"
                                    }),
      
                                    resolve(vendor);
                              });
      
                           });
                        } else {
                           logger.error("vendor not found in the DB with the qrCode #" + qrCode);
                           reject(response.status(404).send("Unable to update vendor profile as no profile matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
                        }
                     }).catch(error => {
                        logger.error("Error occured::" + error);
                        reject(response.status(500).send("Internal Server Error! Unable to update your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
                     });
                  }
                  else {
                     logger.error("vendor already exists with the provided info ::phone/email" + phone + "/" + email);
                     reject(response.status(409).send("Another vendor already exists with this email/phone. If you have not given them, please contact site admin else update with another email ID or phone number."));
                  }
               });
               logger.info('End of update_vendor service');
            }
            else{
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
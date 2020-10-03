'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'), otpUtil = require('../utils/otpUtil'), mailUtil = require('../utils/mailUtil'), phoneUtil = require('../utils/phoneUtil');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to update the existing vendor secret_key, timestamp for every OTP request in the DB 
 based on email*/
exports.update_vendor = function (id, response, isPhone) {

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
      }).then(vendor => {
        if (null == vendor) {
          db.vendorAlias.findOne({
            where: clause
          }).then(vendor => {
            if (null == vendor) {
              logger.error("Unable to send OTP as vendor / executor not found with the mail/ phone #" + id);
              reject(response.status(404).send("Unable to send OTP as your profile is not registered. Please register your profile. Thank you for your business."));
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
                resolve("OTP successfully sent to your registered mobile. Thank you for your business.");
              } else {
                // Sending the OTP to vendor mail
                mailUtil.sendMail(id, "", "", "", "", "", false, true, otp);
                logger.info("OTP sent successfully");
                resolve("OTP successfully sent to your registered email. Thank you for your business.");
              }
            }
          }).catch(error => {
            logger.error("Error occured while update the vendor ::" + error);
            reject(response.status(500).send("Internal Server Error! Unable to send OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
          });
        }
        else {
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
            resolve("OTP successfully sent to your registered email. Thank you for your business.");
          }
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

exports.verify_vendor = function (id, otp, isPhone, response) {

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

      // This function fetches the single vendor with the matched email
      db.vendor.findOne({
        where: clause
      }
      ).then(vendors => {
        var phone;
        const resObj = vendors.map(vendor => {
          phone = "+" + vendor.phone;
          if(vendor.short_name==null)
          vendor.short_name=undefined;
          vendor.city.country_id=undefined;
          if(vendor.logo==null)
          vendor.logo="";
          if(vendor.show_logo==null)
          vendor.show_logo=false;
          return Object.assign(
            {},
            {
              // Getting the info required for the response
              products: vendor.products.map(product => {
                var average_rating = 0, rating = 0;
                product.reviews.forEach(review => {
                  rating = rating + Number(review.rating);
                });
                if (0 != product.reviews.length)
                  average_rating = rating / (product.reviews.length);
                return Object.assign(
                  {},
                  {
                    sku: product.sku,
                    vendor_id: product.VENDOR_ID,
                    name: product.name,
                    short_description: product.short_description,
                    long_description: product.long_description,
                    price: product.price,
                    quantity: product.quantity,
                    currency: product.currency,
                    is_active: product.is_active,
                    is_deleted : product.is_deleted,
                    rating: average_rating,
                    reviews: product.reviews,
                    images: Object.assign(
                      {},
                      {
                        small: product.small_image_path,
                        standard: product.standard_image_path,
                        image_caption: product.image_caption
                      },
                    ),
                    outlet: Object.assign(
                      {},
                      {
                        qrCode: vendor.qr_code,
                        name: vendor.company_name
                      },
                    ),
                    filters: Object.assign(
                      {},
                      {
                        product_family: product.product_family,
                        outlet_location: vendor.city,
                        outlet_state: vendor.state,
                        outlet_pincode: vendor.zip_code
                      },
                    )
                  }
                )
              }),
              product_families: vendor.product_families,
              alerts: vendor.outlet_alerts.map(alert => {
                return Object.assign(
                  {},
                  {
                    priorty: alert.priority,
                    message: alert.message
                  },
                )
              }),
              calender: vendor.vendor_calenders.map(vendor_calender => {
                return Object.assign(
                  {},
                  {
                    day: vendor_calender.day,
                    hours: vendor_calender.hours,
                    isClosed: vendor_calender.is_closed
                  },
                )
              }),
           //   slot_timings:vendor.slot_timings,
           /*    bookings: vendor.users.map(slot_bookings => {
                return Object.assign(
                  {},
                  {
                  booking_id:slot_bookings.booking_id,
                  contact_person_name:slot_bookings.name,
                  contact_phone : slot_bookings.phone,
                  contact_email:slot_bookings.email,
                  attendies_count:slot_bookings.attendies_count,
                  vendor_id :slot_bookings.vendor_id,
                  status:slot_bookings.user_status,
                  timings: Object.assign(
                    {},
                    {
                      date:slot_bookings.date,
                      time : slot_bookings.slot_timing.timings,
                    },
                  ),
                  })
              }), */
              vendor: Object.assign(
                {},
                {
                  qrCode: vendor.qr_code,
                  company_name: vendor.company_name,
                  short_name:vendor.short_name,
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
                  logo:vendor.logo,
                  show_logo:vendor.show_logo
                },
              )
            })
        });
        if (resObj.length == 0) {
          // This function fetches the single vendor with the matched email
          db.vendor.findAll({
            // Including all the required models for the response
            include: [
              {
                model: db.vendorAlias,
                where: clause,
              },
              {
                model: db.products,
                include: [{
                  model: db.currency,
                }, {
                  model: db.reviews
                },
                {
                  model: db.productFamily
                }]
              },
              {
                model: db.vendorCalender
              },
              {
                model: db.alerts,
              },
              {
                model: db.country,
              },
              {
                model: db.state,
              },
              {
                model: db.city,
              },
              {
                model : db.user,
                include: [{
                  model: db.slotTimings,
                }],
              },
              {
                model: db.slotTimings
              },
              {
                model: db.productFamily
              },
            ]
          }
          ).then(vendors => {
            var phone;
            const resObj = vendors.map(vendor => {
              vendor.city.country_id=undefined;
              if(vendor.short_name==null)
              vendor.short_name=undefined
              phone = "+" + vendor.phone;
              if(vendor.logo==null)
              vendor.logo="";
              if(vendor.show_logo==null)
              vendor.show_logo=false;
              return Object.assign(
                {},
                {
                  // Getting the info required for the response
                  products: vendor.products.map(product => {
                    var average_rating = 0, rating = 0;
                    product.reviews.forEach(review => {
                      rating = rating + Number(review.rating);
                    });
                    if (0 != product.reviews.length)
                      average_rating = rating / (product.reviews.length);
                    return Object.assign(
                      {},
                      {
                        sku: product.sku,
                        vendor_id: product.VENDOR_ID,
                        name: product.name,
                        short_description: product.short_description,
                        long_description: product.long_description,
                        price: product.price,
                        quantity: product.quantity,
                        currency: product.currency,
                        is_active: product.is_active,
                        is_deleted : product.is_deleted,
                        rating: average_rating,
                        reviews: product.reviews,
                        images: Object.assign(
                          {},
                          {
                            small: product.small_image_path,
                            standard: product.standard_image_path,
                            image_caption: product.image_caption
                          },
                        ),
                        outlet: Object.assign(
                          {},
                          {
                            qrCode: vendor.qr_code,
                            name: vendor.company_name
                          },
                        ),
                        filters: Object.assign(
                          {},
                          {
                            product_family: product.product_family,
                            outlet_location: vendor.city,
                            outlet_state: vendor.state,
                            outlet_pincode: vendor.zip_code
                          },
                        )
                      }
                    )
                  }),
                  vendorAlias: vendor.vendor_aliases.map(vendor_alias => {
                    return Object.assign(
                      {},
                      {
                        timestamp: vendor_alias.timestamp,
                        secret_key: vendor_alias.secret_key
                      },
                    )
                  }),
                  product_families: vendor.product_families,
                  alerts: vendor.outlet_alerts.map(alert => {
                    return Object.assign(
                      {},
                      {
                        priorty: alert.priority,
                        message: alert.message
                      },
                    )
                  }),
                  calender: vendor.vendor_calenders.map(vendor_calender => {
                    return Object.assign(
                      {},
                      {
                        day: vendor_calender.day,
                        hours: vendor_calender.hours,
                        isClosed: vendor_calender.is_closed
                      },
                    )
                  }),
                  slot_timings:vendor.slot_timings,
                  bookings: vendor.users.map(slot_bookings => {
                    return Object.assign(
                      {},
                      {
                      booking_id:slot_bookings.booking_id,
                      contact_person_name:slot_bookings.name,
                      contact_phone : slot_bookings.phone,
                      contact_email:slot_bookings.email,
                      attendies_count:slot_bookings.attendies_count,
                      vendor_id :slot_bookings.vendor_id,
                      status:slot_bookings.user_status,
                      timings: Object.assign(
                        {},
                        {
                          date:slot_bookings.date,
                          time : slot_bookings.slot_timing.timings,
                        },
                      ),
                      })
                  }),
                  vendor: Object.assign(
                    {},
                    {
                      qrCode: vendor.qr_code,
                      company_name: vendor.company_name,
                      short_name : vendor.short_name,
                      name: vendor.name,
                      email: vendor.email,
                      categories: vendor.category.split(","),
                      phone: vendor.phone,
                      company_address: vendor.company_address,
                      country: vendor.country,
                      state: vendor.state,
                      city: vendor.city,
                      zipcode : vendor.zip_code,
                      languagesPreferred: vendor.language.split(","),
                      submittedDate: vendor.submitted_date,
                      updatedDate: vendor.updated_date,
                      site: vendor.site,
                      description:vendor.description,
                      story:vendor.story,
                      isApproved: vendor.is_approved,
                      timestamp: vendor.timestamp,
                      secret_key: vendor.secret_key,
                      logo:vendor.logo,
                      show_logo:vendor.show_logo
                    },
                  )
                })
            });
            if (resObj.length == 0) {
              logger.error("Executor not found in the DB with the info #" + id);
              reject(response.status(404).json("Unable to fetch your vendor profile as no profile matching with your data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
            }
            else {
              // OTP Verification logic
              var timestamp = resObj[0].vendorAlias[0].timestamp, secret_key = resObj[0].vendorAlias[0].secret_key,

                status = false,

                timeDiff = (Date.now() - timestamp) / 1000 / 60; // This gives time difference in Mins

              // If time difference is more than 10 Mins, then consider that OTP as invalid
              if (timeDiff <= 10 && secret_key == otp)

                status = true;

              // Returning the vendor outlet if the OTP is valid
              if (status == true) {
                logger.info("Found the vendor outlet ::" + id);
                resObj[0].vendor.timestamp = undefined, resObj[0].vendor.secret_key = undefined, resObj[0].vendorAlias = undefined;
                resolve((resObj[0]));
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
          var timestamp = resObj[0].vendor.timestamp, secret_key = resObj[0].vendor.secret_key,

            status = false,

            timeDiff = (Date.now() - timestamp) / 1000 / 60; // This gives time difference in Mins

          // If time difference is more than 10 Mins, then consider that OTP as invalid
          if (timeDiff <= 10 && secret_key == otp)

            status = true;

          // Returning the vendor outlet if the OTP is valid
          if (status == true) {
            logger.info("Found the vendor outlet ::" + id);
            resObj[0].vendor.timestamp = undefined, resObj[0].vendor.secret_key = undefined;
            resolve((resObj[0]));
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
    catch (error) {
      logger.error("Error occured while verifying the vendor ::" + error);
      reject(response.status(500).send("Internal Server Error! Unable to verify OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  });
}



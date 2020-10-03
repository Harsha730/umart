'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'), otpUtil = require('../utils/otpUtil'), mailUtil = require('../utils/mailUtil'), phoneUtil = require('../utils/phoneUtil');
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the product info into the DB 
 to load the product*/

exports.getData = async function (id, response) {

  try {

    logger.info("Entered into getData function");

    /** This function creates the vendor in DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */

return new Promise(function (resolve, reject) {
  
    db.vendor.findAll({
        where: {qr_code:id},
        // Including all the required models for the response
        include: [
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
            model:db.state
          },{
            model:db.country
          },
          {
            model:db.city
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
              logger.error("Executor not found in the DB with the info #" + id);
              reject(response.status(404).json("Unable to fetch your vendor profile as no profile matching with your data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
            }
            else {
                logger.info("Found the vendor outlet ::" + id);
                resObj[0].vendor.timestamp = undefined, resObj[0].vendor.secret_key = undefined, resObj[0].vendorAlias = undefined;
                resolve((resObj[0]));
              
            }
          }, (error => {
            logger.error("Error occured ::" + error);
            reject(response.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
          }))
        

});

  }

  catch (err) {

    logger.error("Error occured while getting the data" + err);

    reject(response.status(500).send("Internal Server Error! Unable to outlet info"));

  }
}
'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');

 logger = logger(module) // Passing the module to the logger

exports.getOutlets = function (locale,res) {
  try {
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getOutlets");
      db.vendor.findAll({
        include: [
          {
            model: products,  // Including all the required modules for the response
            include: [{
              model: db.currency,
            }, {
              model: db.reviews
            },
            {
              model: db.productFamily
            }],
          },
          {
            model : db.vendorCalender,
          },
          {
            model : db.alerts,
          }
        ]
      }
      ).then(vendors => {
        const resObj = vendors.map(vendor => {
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
                    short_desciption: product.short_description,
                    long_desciption: product.long_description,
                    price: product.price,
                    currency: product.currency.code,
                    is_active: product.is_active,
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
                        product_family: product.product_family.name,
                        outlet_location: vendor.city,
                        outlet_state: vendor.state,
                        outlet_pincode: vendor.zip_code
                      },
                    )
                  }
                )
              }),
              alerts: vendor.outlet_alerts.map(alert => {
                return Object.assign(
                  {},
                  {
                    priorty:alert.priority,
                    message : alert.message
                  },
                )
              }),
              calender: vendor.vendor_calenders.map(vendor_calender => {
                return Object.assign(
                  {},
                  {
                    day:vendor_calender.day,
                    hours : vendor_calender.hours,
                    isClosed : vendor_calender.is_closed
                  },
                )
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
                  zip : vendor.zip_code,
                  languagesPreferred: vendor.language.split(","),
                  submittedDate: vendor.submitted_date,
                  updatedDate: vendor.updated_date,
                  site: vendor.site,
                  isApproved: vendor.is_approved
                },
              )
            })
        });
        if (resObj.length == 0) {
          logger.error("Vendors not found in the DB");
          reject(res.status(404).json("Unable to fetch outlets as no product(s)/vendor(s) found. Thank you for your business."));
        }
        else {
          logger.info("Found the vendors outlets ::");
           var data= Object.assign(
            {},
            {
              outlets:resObj
            },
          )
          resolve((data));
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch products. Thank you for your business."));
      }))
    })// end of try
  }
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
  }
}
'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

exports.getProducts = function (id,status,locale,res) {
  try {
    var clause;
    if(status!="")
    clause= {is_deleted:true};
    else
    clause=undefined;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getProducts");
      if(locale=="te_IN"){
        db.translated_vendor.findOne({
          where:{qr_code:id}
        }).then(tempVendor=>{
            if(null==tempVendor){
               console.log('Temp '+tempVendor);
              db.vendor.findOne({
                where: {
                  [op.or]: [{
                    qr_code: {
                      [op.eq]: id //Fetching the products with the vendor qr_code
                    }
                  }
                  ]
                },
                include: [
                  {
                    model: products,  // Including all the required modules for the response
                    where : clause,
                    include: [{
                      model: db.currency,
                    }, {
                      model: db.reviews
                    },
                    {
                      model: db.productFamily
                    }]
                  },
                ]
              }
              ).then(vendor => {
                if(null!=vendor)
                var products = Object.assign(
                    {},
                    {
                      // Getting the info required for the response
                      products: vendor.products.map(product => {
                        var average_rating = 0, rating = 0,temp_tags=[];
                        if(null!=product.tags)
                        temp_tags=product.tags.split(",");
                        product.reviews.forEach(review => {
                          rating = rating + Number(review.rating);
                        });
                        if(product.is_include_shipping==null)
                        product.is_include_shipping=false;
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
                            is_include_shipping : product.is_include_shipping,
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
                            tags:temp_tags,
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
                      })
                    });
                if (vendor==null || undefined==vendor) {
                  logger.error("Vendor not found in the DB with the info #" + id);
                  var result=Object.assign(
                    {},
                    {
                      products:{}
                    },
                  );
                  resolve(result);
                }
                else if (products.products.length == 0) {
                  logger.error("No products available for the vendor #" + id);
                  reject(res.status(404).json("Unable to fetch your products as no products available."));
                } else {
                  logger.info("Found the vendor products ::" + id);
                  resolve(products);
                }
              }, (error => {
                logger.error("Error occured ::" + error);
                reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
              }))
            }
            else{
              db.translated_vendor.findOne({
                where: {
                  [op.or]: [{
                    qr_code: {
                      [op.eq]: id //Fetching the products with the vendor qr_code
                    }
                  }]
                },
                include: [
                  {
                    model: db.translated_product,  // Including all the required modules for the response
                    where : clause,
                    include: [{
                      model: db.translated_currency,
                    }, /* {
                      model: db.translated_re
                    }, */
                    {
                      model: db.translated_product_family
                    }]
                  },
                ]
              }
              ).then(vendor => {
                if(null!=vendor)
                var products = Object.assign(
                    {},
                    {
                      locale:locale,
                      // Getting the info required for the response
                      products: vendor.translated_products.map(product => {
                        var average_rating = 0, rating = 0;
                        /* product.reviews.forEach(review => {
                          rating = rating + Number(review.rating);
                        }); */
                        if(product.is_include_shipping==null)
                        product.is_include_shipping=false;
                       /*  if (0 != product.reviews.length)
                          average_rating = rating / (product.reviews.length); */
                        return Object.assign(
                          {},
                          {
                            sku: product.sku,
                            vendor_id: product.VENDOR_ID,
                            name: product.name,
                            short_description: product.short_description,
                            long_description: product.long_description,
                            price: product.price,
                            is_include_shipping : product.is_include_shipping,
                            quantity: product.quantity,
                            currency: product.translated_currency,
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
                                product_family: product.translated_product_family,
                                outlet_location: vendor.translated_city,
                                outlet_state: vendor.translated_state,
                                outlet_pincode: vendor.zip_code
                              },
                            )
                          }
                        )
                      })
                    });
                if (vendor==null || undefined==vendor) {
                  logger.error("Vendor not found in the DB with the info #" + id);
                  var result=Object.assign(
                    {},
                    {
                      products:{}
                    },
                  );
                  resolve(result);
                }
                else if (products.products.length == 0) {
                  logger.error("No products available for the vendor #" + id);
                  reject(res.status(404).json("Unable to fetch your products as no products available."));
                } else {
                  logger.info("Found the vendor products ::" + id);
                  resolve(products);
                }
              }, (error => {
                logger.error("Error occured ::" + error);
                reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
              }))
            }
        })
    }
    else{
      db.vendor.findOne({
        where: {
          [op.or]: [{
            qr_code: {
              [op.eq]: id //Fetching the products with the vendor qr_code
            }
          }
          ]
        },
        include: [
          {
            model: products,  // Including all the required modules for the response
            where : clause,
            include: [{
              model: db.currency,
            }, {
              model: db.reviews
            },
            {
              model: db.productFamily
            },{
              model:db.priceBook,
              include:[{
                model:db.gst_slabs
              }]
            }],
          },
        ]
      }
      ).then(vendor => {
        if(null!=vendor)
        var products = Object.assign(
            {},
            {
              // Getting the info required for the response
              products: vendor.products.map(product => {
                var average_rating = 0, rating = 0,temp_tags=[];
                if(null!=product.tags)
                temp_tags=product.tags.split(",");
                product.reviews.forEach(review => {
                  rating = rating + Number(review.rating);
                });
                if(product.is_include_shipping==null)
                product.is_include_shipping=false;
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
                    discount_price:product.discount_price,
                    is_include_shipping : product.is_include_shipping,
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
                    tags:temp_tags,
                    price_book:product.price_book,
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
              })
            });
        if (vendor==null || undefined==vendor) {
          logger.error("Vendor not found in the DB with the info #" + id);
          var result=Object.assign(
            {},
            {
              products:{}
            },
          );
          resolve(result);
        }
        else if (products.products.length == 0) {
          logger.error("No products available for the vendor #" + id);
          reject(res.status(404).json("Unable to fetch your products as no products available."));
        } else {
          logger.info("Found the vendor products ::" + id);
          resolve(products);
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
      }))
    }
    })
  }// end of try

  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
  }
}
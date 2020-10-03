'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

exports.getOrderDetails = function (id,status,res) {
  try {
    var clause;
    if(status!="")
    clause= {is_deleted:true};
    else
    clause=undefined;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the getProducts");
      db.order.findOne({
        where: {
     //     [op.or]: [{
            id: {
              [op.eq]: id //Fetching the products with the vendor qr_code
            }
        /*   }
          ] */
        },
        include: [
          {
            model: db.customer,
            include:[{
              model:db.country,
              as:'billing_country'
            },{
              model:db.state,
              as:'billing_state'
            },
            {
              model:db.city,
              as:'billing_city'
            },
            {
              model:db.country,
              as:'shipping_country'
            },{
              model:db.state,
              as:'shipping_state'
            },
            {
              model:db.city,
              as:'shipping_city'
            }] 
          }, 
           // Including all the required modules for the response
          {
            model:db.orderItems,
            include: [{
              model: db.products,
              include:[{
                model:db.currency
              }]
           }]
          },
          {
            model:db.paymentType,
            as:'paymentType'
          },
          {
            model:db.paymentStatus,
            as:'paymentStatus'
          },
          {
            model:db.shipmentType,
            as:'shipmentType'
          },
          {
            model:db.orderStatus,
            as:'orderStatus'
          },
          {
            model:db.currency
          },
          {
            model:db.orderStatus,
            as:'orderStatus'
          },
        ]
      }
      ).then(order => {
        if(null!=order){
          if(order.gst_percent==null)
          order.gst_percent=0;
          if(order.tax_price==null)
          order.tax_price=0;
          if(order.grand_total==null)
          order.grand_total=order.price;
          if(order.status_notes==null)
          order.status_notes="";
          var temp_phone="+"+order.customer.phone;
        var orders = Object.assign(
            {},
            {
              // Getting the info required for the response
              products: order.order_items.map(item => {
                return Object.assign(
                  {},
                  {
                    ordered_quantity:item.quantity,
                    sku: item.product.sku,
                    vendor_id: item.product.VENDOR_ID,
                    name: item.product.name,
                    short_description: item.product.short_description,
                    long_description: item.product.long_description,
                    price: item.product.price,
                    currency:item.product.currency,
                    quantity:item.product.quantity,
                    currency: item.product.currency.code,
                    is_active: item.product.is_active,
                    discount_price:item.product.discount_price,
                    images: Object.assign(
                      {},
                      {
                        small: item.product.small_image_path,
                        standard: item.product.standard_image_path,
                        image_caption: item.product.image_caption
                      },
                    ),
                  }
                )
              }),
              customer:Object.assign({},{
                billing:Object.assign({},{
                  name:order.customer.name,
		              phone: temp_phone,
		              email:order.customer.email,
		              country: order.customer.billing_country,
		              state: order.customer.billing_state,
		              city: order.customer.billing_city,
		              zip: order.customer.zip,
		              address: order.customer.billing_address,
                }),
                shipping:Object.assign({},{name:order.customer.shipping_name,
		              phone: order.customer.shipping_phone,
		              email:order.customer.shipping_email,
		              country: order.customer.shipping_country,
		              state: order.customer.shipping_state,
		              city: order.customer.shipping_city,
		              zip: order.customer.shipping_zip,
		              address: order.customer.shipping_address}),
              }),
              payment:Object.assign({},{
                total_price:order.price,
                currency:order.currency.code,
                type:order.paymentType,
                status:order.paymentStatus,
                notes:order.payment_notes,
                updated_date:order.shipment_updated_date,
                gst_percentage:order.gst_percent,
                gstTax_price:order.tax_price,
                grand_total:order.grand_total
              }),
              shipping:Object.assign({},{
                type:order.shipmentType,
                tracking:order.shipment_tracking,
                notes:order.shipment_notes,
                updated_date:order.shipment_updated_date
              }),
              order:Object.assign({},{
                created_date:order.created_date,
                updated_date:order.updated_date,
                status:order.orderStatus,
                notes:order.status_notes
              })
            },
            );
          }
        if (order==null || undefined==order) {
          logger.error("Vendor not found in the DB with the info #" + id);
          var result=Object.assign(
            {},
            {
              products:[],
              customer:{},
              payment:{},
              shipping:{},
              order:{}
            },
          );
          resolve(result);
        }
      else {
          logger.info("Found the vendor products ::" + id);
          resolve(orders);
        }
      }, (error => {
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
      }))
    })// end of try
  }
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
  }
}
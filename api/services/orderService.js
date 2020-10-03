'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
// transaction=db.Sequelize.Transaction();

var productUtil = require('../utils/productUtil'),
  logger = require('../config/winston_Logger');
const { reject } = require("async");
const dbConfig = require("../config/db.config");
const { order } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the product info into the DB 
 to load the product*/

exports.order = async function (data, response) {

  try {

    logger.info("Entered into order function");

    var sku = productUtil.getSku(), custId;

    /** This function creates the vendor in DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */
    return new Promise(function (resolve, reject) {
      var email = data.customer.billing.email, phone = data.customer.billing.phone, name = data.customer.billing.name, orderId = sku, price = data.order.total_price, outlet_name = data.order.outlet.name,
        vendor_name = data.order.outlet.vendor_name,
        vendor_email = data.order.outlet.vendor_mail,
        vendor_phone = data.order.outlet.vendor_phone;
      return db.sequelize.transaction(function (t) {
        return db.customer.create({
          name: data.customer.billing.name,
          phone: data.customer.billing.phone,
          email: data.customer.billing.email,
          country_id: data.customer.billing.country.id,
          state_id: data.customer.billing.state.id,
          city_id: data.customer.billing.city.id,
          zip: data.customer.billing.zip,
          billing_address: data.customer.billing.address,
          shipping_name: data.customer.shipping.name,
          shipping_phone: data.customer.shipping.phone,
          shipping_email: data.customer.shipping.email,
          shipping_country_id: data.customer.shipping.country.id,
          shipping_state_id: data.customer.shipping.state.id,
          shipping_city_id: data.customer.shipping.city.id,
          shipping_zip: data.customer.shipping.zip,
          shipping_address: data.customer.shipping.address
        }, { transaction: t }).then(result => {
          if (result) {
            // Sending the confirmation mail to the vendor
            var id = result.id;
            custId = id;
            var order = db.order;
            return order.create({
              id: sku,
              checkout_type: 'Guest',
              customer_id: id,
              vendor_id: data.order.outlet.qr_code,
              price: data.order.total_price,
              created_date: data.order.created_date,
              updated_date: data.order.updated_date,
              items: data.order.products.length,
              payment_type: 1,
              payment_status: 1,
              payment_notes: "",
              shipment_type: 1,
              shipment_tracking: "",
              shipment_notes: "",
              currency_id: data.order.currency,
              shipment_updated_date: "",
              payment_updated_date: "",
              status: 1,
              status_notes:"",
              gst_percent:data.order.gst_percentage,
              tax_price:data.order.gstTax_price,
              grand_total:data.order.grand_total
            }, { transaction: t }).then(order => {
          //    console.log("Order inserted successfully");
              var order_id = order.id, orderItems = [];
              // console.log(data.order.products);
              for (var i = 0; i < data.order.products.length; i++) {
                //    data.order.products.forEach(items => {
                var item = {
                  order_id: sku,
                  product_id: data.order.products[i].sku,
                  quantity: data.order.products[i].quantity,
                  customer_id: custId,
                  vendor_id: data.order.outlet.qr_code
                }
                orderItems.push(item);
              };
              return db.orderItems.bulkCreate(orderItems, { transaction: t }).then(data => {
              })
            })
          }
        })
      }).then(function (result) {
        var customerMail = require('../utils/customerOrderBookingMail'), vendorMail = require('../utils/vendorOrderBooking');
        //  console.log(email);
        customerMail.orderBookingMail(email, name, outlet_name, orderId, vendor_name, vendor_email, vendor_phone, data.order.total_price, data.order.currency, data.customer.billing, data.customer.shipping, data.order.products,data);
        vendorMail.orderBooking(vendor_email, vendor_name, orderId, name, phone, price, data.order.currency, data.order.created_date, data.order.products,data);
        data.order.outlet.vendor_phone="+"+data.order.outlet.vendor_phone;
        var alias;
        db.vendor.findOne({
          where :{qr_code:data.order.outlet.qr_code},
          include :[{
            model : db.vendorAlias,
            required:false,
            where:{
              "is_payment_contact":true
            }
          }]
        }).then(temp_vendor=>{
          if(null!=temp_vendor){
          alias=temp_vendor.vendor_aliases.map(alias => {
            var payment_method,   temp_phone="+"+alias.phone,
            temp_email=alias.email;
            if("Yes"==alias.privacy_mode){
              temp_phone="";
              temp_email="";
            }
           
            if(Boolean(alias.payment_method))
            payment_method=alias.payment_method.split(",");
            else
            payment_method=[];
         
            return Object.assign(
              {},
              {
                 name : alias.name,
                 email: temp_email,
                 phone:temp_phone,
                 payment_method:payment_method
              })
            })
            var res = {orderId: orderId,
              vendor_info:data.order.outlet,
              alias:alias};
            resolve(res);
          }else{
            var res = {orderId: orderId,
              vendor_info:data.order.outlet,
              alias:[]};
            resolve(res);
          }
        })
      }).catch(function (err) {
        console.log(err);
        reject(response.status(500).send("Unable place your order"));
      });
    })
  }
  catch (err) {
    logger.error("Error occured while loading the product " + err);
    reject(response.status(500).send("Internal Server Error! Unable to add your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
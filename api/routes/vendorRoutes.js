'use strict';

/* This module contains the routing info, based on the incoming request URI it maps 
the request to the corresponding vendor controller functions*/

module.exports = function (app) {

  var vendorController = require('../controllers/vendorController'); // Importing the vendor controller
  var oAuthService = require('../services/OAuthService');

  // Routing incoming requests

  // Route for vendor register, update and fetch
  app.route('/uni-commerce/vendor')
    .get(vendorController.get_vendor)
    .put(vendorController.update_vendor)
    .post(vendorController.create_vendor)

  // Route for fetching all vendors 
  app.route('/uni-commerce/vendors')
    .get(vendorController.get_all_vendors)

  // Route for sending query mail
  app.route('/sendmail/query')
    .post(vendorController.send_mail)

  app.route('/uni-commerce/vendor/products')
    .get(vendorController.fetch_products_by_vendor)

  app.route('/uni-commerce/vendor/products/deleted')
    .get(vendorController.fetch_deleted_products_by_vendor)

  app.route('/uni-commerce/vendor/outlet/:short_name?')
    .get(vendorController.fetch_outlet_by_name)

  app.route('/uni-commerce/vendors/outlets')
    .get(vendorController.fetch_outlets)

  // Route for vendor deletion
  app.route('/uni-commerce/vendor/delete')
    .delete(vendorController.delete_vendor)

  app.route('/uni-commerce/vendor/hard-delete')
    .delete(vendorController.hard_vendor_delete)

  // Route vendor OTP request
  app.route('/uni-commerce/vendor/generate-otp')
    .post(vendorController.get_otp)

  // Route to vendor OTP verification and vendor fetch after successful verification
  app.route('/uni-commerce/vendor/verify')
    .post(vendorController.verify_otp)

  app.route('/uni-commerce/vendor/product')
    .get(vendorController.fetch_product_by_sku)

  app.route('/uni-commerce/loadData')
    .get(vendorController.loadProductsIntoDB)

  app.route('/home')
    .get(vendorController.home)

  /* app.route('/uni-commerce/verify-email')
    .get(vendorController.test) */

  app.route('/uni-commerce/geo-list')
    .get(vendorController.get_geo_list)

    app.route('/uni-commerce/currency')
    .get(vendorController.currencies)

    app.route('/uni-commerce/product-family')
    .get(vendorController.productFamily)

  app.route('/uni-commerce/countries')
    .get(vendorController.countries)

  app.route('/uni-commerce/states')
    .get(vendorController.states)

  app.route('/uni-commerce/cities')
    .get(vendorController.cities)

  app.route('/uni-commerce/upload')
    .post(vendorController.uploadFile)

  app.route('/uni-commerce/product')
    .put(vendorController.update_product)
    .post(vendorController.add_product)

  app.route('/uni-commerce/product/delete')
    .put(vendorController.delete_product)

  app.route('/uni-commerce/user')
    .post(vendorController.book_slot)

  app.route('/uni-commerce/vendor/slots')
    .get(vendorController.fetchSlots)

  app.route('/uni-commerce/confirm-slot')
   .post(vendorController.confirmSlot)

  app.route('/signup')
  .post(vendorController.signup)

  app.route('/confirm-registration')
  .post(vendorController.confirmSignIn)

  app.route('/signin')
  .post(vendorController.signin)

  app.route('/sign-out')
  .post(vendorController.signOut)

  app.route('/uni-commerce/vendor/product-family')
  .post(vendorController.add_product_family)
  .get(vendorController.get_productFamily_by_vendor)

  app.route('/uni-commerce/product/re-store') 
  .put(vendorController.restore_product)

  app.route('/uni-commerce/vendor/bookings')
  .get(vendorController.getBookings_by_vendor);

  app.route('/uni-commerce/vendor/bookings/approved')
  .get(vendorController.get_approved_vendor_bookings);
  
  app.route('/uni-commerce/vendor/bookings/rejected')
  .get(vendorController.get_rejected_vendor_bookings);

  app.route('/uni-commerce/user/confirmRegistration')
   .post(vendorController.confirmRegistration)
  
  app.route('/uni-commerce/customer/order')
   .post(vendorController.process_Order)

  app.route('/uni-commerce/vendor/orders')
    .get(vendorController.getOrderList)
 
  app.route('/uni-commerce/vendor/order/details')
    .get(vendorController.getOrderDetails)

    app.route('/uni-commerce/vendor/order/payment-reminder')
    .post(vendorController.remindOrderPayment)

    app.route('/uni-commerce/vendor/order/payment')
    .put(vendorController.updateOrderPayment)

    app.route('/uni-commerce/vendor/order/shipment')
    .put(vendorController.updateShipmentDetails)

    app.route('/uni-commerce/order/payment-type')
    .get(vendorController.paymentType)

    app.route('/uni-commerce/order/payment-status')
    .get(vendorController.paymentStatus)

    app.route('/uni-commerce/order/order-status')
    .get(vendorController.orderStatus)

    app.route('/uni-commerce/order/shipment-type')
    .get(vendorController.shipmentType)

    app.route('/uni-commerce/order/status')
    .put(vendorController.updateOrderStatusDetails)

    app.route('/uni-commerce/loadStates')
    .get(vendorController.loadStates)

    app.route('/uni-commerce/loadCities')
    .get(vendorController.loadCities)

    app.route('/uni-commerce/vendor/price-book')
   .post(vendorController.add_price_book)

   app.route('/uni-commerce/vendor/alias')
   .post(vendorController.create_vendor_alias)
   .put(vendorController.update_vendor_alias) 

   app.route('/uni-commerce/vendor/alias/generate-otp')
    .post(vendorController.send_vendor_alias_code)

  // Route to vendor OTP verification and vendor fetch after successful verification
  app.route('/uni-commerce/vendor/alias/verify')
    .post(vendorController.verify_vendor_alias)

  app.route('/uni-commerce/vendor/price_book')
    .get(vendorController.fetch_price_book_by_vendor)

    app.route('/uni-commerce/price-book/slabs')
    .get(vendorController.fetch_gst_slabs)

    app.route('/uni-commerce/vendor/alias')
    .get(vendorController.fetch_alias_list_by_vendor)
};


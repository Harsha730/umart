'use strict';

const db = require('../models/sequelize');
const { error } = require('winston');
const { state } = require('../models/sequelize');

var logger = require('../config/winston_Logger'),                             // Importing the logger service
  vendorRegisterService = require('../services/vendorRegisterService'), // Importing the registration service
  vendorFetchService = require('../services/vendorFetchService'),           //Importing the fetch service
  vendorUpdateService = require('../services/vendorUpdateService'),        // Importing the update service
  vendorDeleteService = require('../services/vendorDeleteService'),        // Importing the Delete service
  mailUtil = require('../utils/mailUtil'),                              //importing the mail util
  otpUtil = require('../utils/otpUtil'),                               //importing the OTP util
  productFetchService = require('../services/productFetchService'),      // importing the product fetch service
  outletFetchService = require('../services/outletFetchService'),      // importing the outlet fetch service
  otpService = require('../services/vendorOTPService'),               // importing the vendor otp service
  productLoadService = require('../services/productLoadService'),
  productUpdateService = require('../services/productUpdateService'),
  productDeleteService = require('../services/productDeleteService'),
  //passing the module to the logger
  logger = logger(module);

// This function responds to the vendor registration POST request
exports.create_vendor = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into created_vendor");

      var vendorInfo = JSON.stringify(req.body);

      var data = JSON.parse(vendorInfo);
      var header = JSON.stringify(req.headers),
      headerData = JSON.parse(header),
      locale = headerData.locale;

      logger.info("parsing of request body completed");

      // Getting the Vendor Info
      var company_name = data.company_name,
        name = data.name,
        email = data.email,
        categories = data.categories,
        phone = data.phone,
        company_address = data.company_address,
        country = data.country,
        state = data.state,
        city = data.city,
        zipcode = data.zipcode,
        languagesPreferred = data.languagesPreferred,
        submittedDate = data.submittedDate;

      // Getting the Phone as string
      if (Boolean(phone))
        phone = phone + "";

      // Mandatory check for vendor Registration

      if (Boolean(categories) && Boolean(company_name) && Boolean(name) && Boolean(company_address) && Boolean(country) && Boolean(phone) && Boolean(email) && Boolean(languagesPreferred) && Boolean(state) && Boolean(city) && Boolean(submittedDate)) {

        // Invoking the Register Servic

        var vendorRegisterPromise = vendorRegisterService.registerVendor(data,locale,res);
        vendorRegisterPromise.then(function (result) {

          logger.info("End of create_vendor :: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while registering the vendor with the info ## ");
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial vendor info provided for the registration ##" + data);
        if("te_IN"==locale)
        res.status(400).send("అవసరమైన డేటా లేనందున మీ సమాచారాన్ని సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు.")
        else
        res.status(400).send("Unable to submit your information as required data is missing. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    if("te_IN"==locale)
    res.status(500).send("అంతర్గత సర్వర్ లోపం! మీ ప్రొఫైల్‌ను సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు.")
    else
    res.status(500).send("Internal Server Error! Unable to submit your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};


// This function responds to the single vendor profile fetch GET request (by phone or email or QR code)
exports.get_vendor = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into the get_vendor function");

      // Getting the search parameter

      var SearchInfo = req.query.id,
      header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),
        locale = headerData.locale;
      
        if (Boolean(SearchInfo)) {
        // Fetching the vendor based on Search param
        var vendorFetchPromise = vendorFetchService.fetchVendor(SearchInfo,locale,res);
        vendorFetchPromise.then(function (result) {
          logger.info("End of getVendor function")
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occured while fetching the vendor with the info ##" + SearchInfo);
          // Returning teh error response
          errorResponse;
        })
      }
      else {

        logger.error("Terminating the process as no data provided to fetch the vendor")
        res.status(400).send("Unable to fetch your profile as required data is missing. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")

      }
    };
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to fetch your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};


// This function responds to the GET request to fetch all the vendor profiles
exports.get_all_vendors = function (req, res) {

  try {

    // Fetching all the vendors

    logger.info('Entered into get_all_vendors function');
    var header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    locale = headerData.locale;

    var fetchVendorsPromise = vendorFetchService.fetchAllVendors(locale,res);
    fetchVendorsPromise.then(function (result) {
      logger.info("End of get_all_vendors function")
      res.json(result)
    }, function (errorResponse) {
      logger.error("Error occurred while fetching vendors profiles");
      // Returning the error respose
      errorResponse;
    });
    logger.info('End of get_all_vendors');
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to fetch vendor profiles. One of our agents will reach you soon. Thank you for your business.")
  }

};

// This function responds to the PUT request to update the vendor profile
exports.update_vendor = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into the update_vendor function")

      var vendorInfo = JSON.stringify(req.body);

      // Parsing the request body
      var data = JSON.parse(vendorInfo);

      // Getting the Vendor Info
      var qrCode = data.qrCode,
        company_name = data.company_name,
        name = data.name,
        email = data.email,
        categories = data.categories,
        phone = data.phone,
        company_address = data.company_address,
        country = data.country,
        state = data.state,
        city = data.city,
        languagesPreferred = data.languagesPreferred,
        submittedDate = data.submittedDate,
        updatedDate = data.updatedDate,
        site = data.site,
        isApproved = data.isApproved,
        comments = data.comments,
        zipcode = data.zipcode,
        price_book_id=data.price_book_id;
      // Getting the Phone as string
      if (Boolean(phone))
        phone = phone + "";

      // Setting default values to isApproved and Comments if not provided
      if (isApproved != true && isApproved != false)
        isApproved = true;
      if (!Boolean(comments))
        comments = "";

      if(!Boolean(price_book_id))
      price_book_id=null;

      // Check on required Data  
      if (Boolean(qrCode) && Boolean(company_name) && Boolean(name) && Boolean(categories) && Boolean(company_address) && Boolean(country) && Boolean(state) && Boolean(city) && Boolean(languagesPreferred) && Boolean(submittedDate) && Boolean(updatedDate) && Boolean(phone) && Boolean(email) && Boolean(zipcode) && (categories.length != 0) && (languagesPreferred.length != 0)) {

        // Invoking the VendorUpdateService
        var updateVendorPromise = vendorUpdateService.update_vendor(qrCode, company_name, name, email, categories, phone, company_address, country, state, city, zipcode, languagesPreferred, updatedDate, site, isApproved, comments,price_book_id,res);
        updateVendorPromise.then(function (result) {
          logger.info("End of update vendor function");
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occurred while updating the vendor profile");
          // Returning the error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as required data (email/phone/qrCode) not provided to update the vendor ##" + vendorInfo);
        res.status(400).send("Unable to update your information as required data is missing. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to update your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

// This function responds to the DELETE request to delete specific vendor profile (soft delete)
exports.delete_vendor = function (req, res) {

  try {
    if (req.body) {

      logger.info("Entered into the  delete_vendor function");

      var header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),

        id = headerData.id,

        flag = headerData.delete,

        comments = headerData.comments;

      if (Boolean(flag) && Boolean(id) && flag == "true" && Boolean(comments)) {

        logger.info('Invoking the delete vendor Service.')

        var deleteVendorPromise = vendorDeleteService.delete_vendor(id, comments, res);
        deleteVendorPromise.then(function (result) {
          logger.info("End of delete_vendor function");
          res.json(result)
        }, function (errorResponse) {
          logger.error("Error occurred while deleting vendor profile :: ");
          logger.info('End of delete_vendor function');
          // Returning the error response
          errorResponse;
        });
      }
      else {
        logger.error("Required info missed for soft deletion of vendor profile");
        res.status(400).send("Please provide id, comments and delete flag to delete vendor profile. Thank you for your business");
      }
    }
    else {
      logger.error("Required info missed for soft deletion of vendor profile");
      res.status(400).send("Please provide required info to delete vendor profile. Thank you for your business");
    }

  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to delete vendor profile. Thank you for your business.")
  }
}

// This function responds to the DELETE request to delete vendor profile (hard delete)
exports.hard_vendor_delete = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into the  delete_vendor function");

      // Getting the request headers
      var header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),
        id = headerData.id,
        flag = headerData.delete,
        user = headerData.user,
        pwd = headerData.password;

      if (Boolean(user) && Boolean(pwd) && Boolean(flag) && Boolean(id) && flag == "true") {

        logger.info('Invoking the delete vendor Service.')

        var deleteVendorPromise = vendorDeleteService.hard_vendor_delete(id, headerData, res);
        deleteVendorPromise.then(function (result) {
          logger.info("End of delete_vendor function");
          res.json(result)
        }, function (errorResponse) {
          logger.error("Error occurred while deleting vendor profile :: ");
          // Returning the error response
          errorResponse;
        });
        logger.info('End of delete_vendor function');
      }
      else {
        logger.error("unable to hard delete the vendor as required data is missing");
        res.status(406).send("Please provide user, password, id and delete flag to delete vendor profile. Thank you for your business");
      }
    }
    else {
      logger.error("unable to hard delete the vendor as required data is missing");
      res.status(400).send("Please provide required info to delete vendor profile. Thank you for your business");
    }
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to delete vendor profile. Thank you for your business.")
  }
}

// This function responds to the POST request to send vendor Query to the UniCommerce mail
exports.send_mail = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into send_mail");

      var vendorInfo = JSON.stringify(req.body);

      var data = JSON.parse(vendorInfo);

      logger.info("parsing of request body completed");

      // fetching the vendor info

      var name = data.name,
        phone = data.phone,
        email = data.email,
        query = data.query,
        country = data.country;

      if (Boolean(name) && Boolean(phone) && Boolean(email) && Boolean(query) && Boolean(country)) {

        mailUtil.sendMail(email, "", name, phone, query, country, false, false, "");

        logger.info("End of send mail");

        res.json("Query sent successfully! One of our agents will reach you soon. Thank You for your business.")

      }
      else {
        logger.error("Unable send query required info is missing.");
        res.status(400).send("Please provide required info to send query. Thank you for your business.");
      }
    }

  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to send your query. One of our agents will reach you soon. Thank you for your business.")
  }
}

exports.get_otp = function (req, res) {

  try {

    //importing the required dependencies

    if (req.body) {

      logger.info("Entered into get_OTP function");

      var Data = JSON.stringify(req.body),
        vendorData = JSON.parse(Data),
        id = vendorData.id,
        isPhone = false,

        // Phone validation
        phonePattern = /^\d{10}$/;

      if (Boolean(id)) {
        if (id.match(phonePattern)) {
          isPhone = true;
          logger.info("Provided mobile number for OTP");
        }
        else {
          isPhone = false;
          logger.info("Provided email for OTP");
        }

        var otpServicePromise = otpService.update_vendor(id, res, isPhone);

        otpServicePromise.then(function (result) {

          res.json(result);

        }, function (errorResponse) {

          logger.error("Error occured while sending OTP ::");

          // returning the error response
          errorResponse;

        });
      }

      else {
        logger.error("Unable to send OTP as mail is missing");
        res.status(400).send("Unable to send OTP. Please provide your registered email/mobile number to get OTP. Thank you for your business.")
      }

      logger.info("End of get_OTP function");

    }

  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to send OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }

}

exports.verify_otp = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into verify_OTP function");

      var Data = JSON.stringify(req.body),

        vendorData = JSON.parse(Data),
        header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),
        locale = headerData.locale,
        id = vendorData.id,
        otp = vendorData.otp,
        //    isVendor= vendorData.isVendor,
        isPhone = false,
        // Phone validation
        phonePattern = /^\d{10}$/;

      if (Boolean(id) && Boolean(otp)) {

        if (id.match(phonePattern))
          isPhone = true;

        // Fetching the vendor based on Search param
        var vendorFetchPromise = otpService.verify_vendor(id, otp, isPhone,locale, res);
        vendorFetchPromise.then(function (vendor) {
          res.json(vendor);
        }, function (errorResponse) {
          logger.error("Error occured while verifying the vendor OTP");
          // returning error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as required data not provided to verify the vendor")
        res.status(400).send("Please provide OTP and registered email to verify. For quick response, please reach our support team at Contact Us. Thank you for your business.");
      }

    }
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to verify your OTP. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
}

// This function responds to the POST request to send vendor Query to the UniCommerce mail
exports.fetch_products_by_vendor = function (req, res) {

  if (req.body) {

    try {

      logger.info("Entered into the products fetch function");

      var id = req.query.id,
      header = JSON.stringify(req.headers),
      headerData = JSON.parse(header),
      locale= headerData.locale;
    
      if (Boolean(id)) {

        logger.info("Fetching the products of the vendor ::" + id);

        var productFetchPromise = productFetchService.getProducts(id, "",locale,res);
        productFetchPromise.then(products => {
          logger.info("returning the success response");
          res.json(products);
        }, (error => {
          logger.info("Sending error response");
          error;
        }))
      }
      else {
        logger.error("Terminating the process as required data not provide to fetch the products")
        res.status(400).send("Please provide vendor id to get the products.");
      }
    }// end of try
    catch (error) {
      logger.error("Error occured ::" + error);
      res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business.")
    }// end of catch
  }
};

exports.fetch_deleted_products_by_vendor = function (req, res) {

  if (req.body) {

    try {

      logger.info("Entered into the fetch_deleted_products_by_vendor");

      var id = req.query.id,
      header = JSON.stringify(req.headers),
      headerData = JSON.parse(header),
      locale= headerData.locale;

      if (Boolean(id)) {

        logger.info("Fetching the deleted products of the vendor ::" + id);

        var productFetchPromise = productFetchService.getProducts(id, true,locale, res);
        productFetchPromise.then(products => {
          logger.info("returning the success response");
          res.json(products);
        }, (error => {
          logger.info("Sending error response");
          error;
        }))
      }
      else {
        logger.error("Terminating the process as required data not provide to fetch the deleted products")
        res.status(400).send("Please provide vendor id to get the deleted products.");
      }
    }// end of try
    catch (error) {
      logger.error("Error occured ::" + error);
      res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business.")
    }// end of catch
  }
};

exports.fetch_outlet_by_name = function (req, res) {

  if (req.body) {

    try {

      logger.info("Entered into the outlet fetch function");

      var short_name = req.params['short_name'],
      header = JSON.stringify(req.headers),
      headerData = JSON.parse(header),
      locale= headerData.locale;

      logger.info("Fetching the outlet using name ::" + [short_name]);

      if (Boolean([short_name]) && undefined != short_name) {

        var outletFetchPromise = outletFetchService.getOutlet(short_name, "",locale,res);
        outletFetchPromise.then(outlet => {
          logger.info("returning the success response");
          res.json(outlet);
        }, (error => {
          logger.info("Sending error response");
          error;
        }))
      }
      else {
        logger.error("Outlet name not provided.");
        res.status(406).send("Please provide outlet name. Thank you for your business.");
      }

    }// end of try
    catch (error) {
      logger.error("Error occured ::" + error);
      res.status(500).send("Internal Server Error! Unable to fetch your outlet. Thank you for your business.")
    }// end of catch
  }
};

exports.fetch_product_by_sku = function (req, res) {

  if (req.body) {

    try {

      logger.info("Entered into the fetch_product_by_sku function");

      var qrCode = req.query.id,
        sku = req.query.sku,
        header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),
        locale= headerData.locale;

      logger.info("Fetching the product of the vendor ::");

      if (Boolean(qrCode) && Boolean(sku)) {
        var outletFetchPromise = outletFetchService.getOutlet(qrCode, sku,locale,res);
        outletFetchPromise.then(outlet => {
          logger.info("returning the success response");
          res.json(outlet);
        }, (error => {
          logger.info("Sending error response");
          error;
        }))
      }
      else {
        logger.error("Error occured missing qr_code or sku");
        res.status(400).send("Unable to fetch product required data is missing. Thank you for your business");
      }
    }// end of try
    catch (error) {
      logger.error("Error occured ::" + error);
      res.status(500).send("Internal Server Error! Unable to fetch your product(s). Thank you for your business.")
    }// end of catch
  }
};

exports.loadProductsIntoDB = function (req, res) {

  try {
    var s3BucketName = req.query['bucket-name'],
      fileName = req.query['file-name'],
      s3Util = require('../utils/s3Util'), loadProductsintoDB = require('../utils/loadProductsintoDB');
    s3Util.getProductsFromS3(s3BucketName, fileName).then(result => {
      var products = result;
      loadProductsintoDB.loadProducts(products).then(status => {
        logger.info("Successfully loaded the data into DB");
        res.send(status);
      }, failed => {
        logger.error("Error occured :" + failed)
        res.status(500).send(failed);
      })
    },
      failed => {
        logger.error("Error occured :" + failed);
        res.status(500).send("Unable to get Excel Data");
      })
  }
  catch (error) {
    logger.error("Error occured ::" + error);
  }
}

exports.home = function (req, res) {
  // Importing the required modules
  res.json("Hello World! Welcome to umart44.com");
}

exports.fetch_outlets = function (req, res) {
  var outletsFetchService = require('../services/outletsFetchService');
  if (req.body) {
    try {
     var header = JSON.stringify(req.headers),
     headerData = JSON.parse(header),
     locale= headerData.locale;

    logger.info("Entered into the fetch_outlets function");

      var outletsFetchPromise = outletsFetchService.getOutlets(locale,res);
      outletsFetchPromise.then(outlets => {
        logger.info("returning the success response");
        res.json(outlets);
      }, (error => {
        logger.info("Sending error response");
        error;
      }))
    }// end of try
    catch (error) {
      logger.error("Error occured ::" + error);
      res.status(500).send("Internal Server Error! Unable to fetch outlets info. Thank you for your business.")
    }// end of catch
  }
}

/* exports.test = function (req, res) {
  var header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    id = headerData.param;
  if (Boolean(id)) {
    var data = vendorFetchService.fetchAllVendorsByCase(res, id);
    data.then(status => {
      res.json(status);
    })
  }
  else {
    res.status(400).send("Please provide required info");
  }
} */

exports.get_geo_list = function (req, res) {
  var header = JSON.stringify(req.headers),
  headerData = JSON.parse(header),
  locale=headerData.locale;
  vendorFetchService.get_geo_list(locale,res).then(status => {
    res.json(status);
  })
}

exports.countries = function (req, res) {
  var countryFetchService = require('../services/countryFetchService');
  var header = JSON.stringify(req.headers),
  headerData = JSON.parse(header),
  locale=headerData.locale;
  countryFetchService.getCountries(locale).then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching countries");
    error;
  })
}

exports.states = function (req, res) {
  var statesFetchService = require('../services/stateFetchService'),
    header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    id = headerData.id,
    locale=headerData.locale;
  statesFetchService.getStates(id,locale, res).then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching states");
    error;
  })
}

exports.cities = function (req, res) {
  var date = new Date(1592309617564);
  var cityFetchService = require('../services/cityFetchService'),
    header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    id = headerData.id,
    locale=headerData.locale;
  cityFetchService.getCities(id,locale,res).then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching cities");
    error;
  })
}

exports.uploadFile = function (req, res) {
  var fileUpload = require('../utils/s3FileUpload');
  if (Boolean(req.files.file)) {
    var uploadPromise = fileUpload.upload(req.files.file, res);
    uploadPromise.then(data => {
      logger.info("Sending the uploaded file location");
      var response = Object.assign(
        {},
        {
          path: data
        }
      )
      res.json(response);
    }, error => {
      logger.error("Sending the error response");
      error;
    })
  }
  else {
    logger.error("Missing file info to upload");
    res.status(403).send("Please send the file to upload.");
  }
}

exports.add_product = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into create_product");

      var productInfo = JSON.stringify(req.body);

      var data = JSON.parse(productInfo);

      logger.info("parsing of request body completed");

      var name = data.name,
        short_description = data.short_description,
        long_description = data.long_description,
        price = data.price,
        currency_id = data.currency_id,
        vendor_id = data.vendor_id,
        quantity = data.quantity,
        product_family_id = data.product_family_id,
        small_image_path = data.small_image_path,
        standard_image_path = data.standard_image_path,
        image_caption = data.image_caption,
        is_active = data.is_active;

      // Getting the Phone as string
      if (!Boolean(short_description))
        data.short_description = "";
      if (!Boolean(long_description))
        data.long_description = "";
      if (!Boolean(image_caption))
        data.image_caption = "";
      // Mandatory check for product insert

      if (Boolean(name) && Boolean(price) && Boolean(currency_id) && Boolean(vendor_id) && Boolean(quantity) && Boolean(product_family_id) && Boolean(small_image_path) && Boolean(standard_image_path) && (is_active == true || is_active == false)) {
        // Invoking the product insert service

        var productLoadPromise = productLoadService.loadProduct(data, res);
        productLoadPromise.then(function (result) {

          logger.info("End of add_product :: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while adding the product with the info ## " + data.name);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial product info provided for the adding##");
        res.status(400).send("Unable to add your product as required data is missing. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

// This function responds to the PUT request to update the vendor profile
exports.update_product = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into the update_vendor function");

      var productInfo = JSON.stringify(req.body);

      // Parsing the request body
      var data = JSON.parse(productInfo);

      var sku = data.sku,
        name = data.name,
        short_description = data.short_description,
        long_description = data.long_description,
        price = data.price,
        currency_id = data.currency_id,
        vendor_id = data.vendor_id,
        quantity = data.quantity,
        product_family_id = data.product_family_id,
        small_image_path = data.small_image_path,
        standard_image_path = data.standard_image_path,
        image_caption = data.image_caption,
        is_active = data.is_active,
        tags=data.tags,
        price_book_id=data.price_book_id,
        discount_price=data.discount_price;

      var is_include_shipping;

      if (data.is_include_shipping == "false")
        is_include_shipping = false;
      else
        is_include_shipping = true;

      if(!Boolean(tags))
      tags="";

      if(!Boolean(discount_price))
      discount_price=0;

      // Check on required Data
      if (Boolean(name) && Boolean(sku) && Boolean(price) && Boolean(currency_id) && Boolean(vendor_id) && Boolean(quantity) && Boolean(product_family_id) && Boolean(small_image_path) && Boolean(standard_image_path) && (is_active == true || is_active == false)) {

        // Invoking the VendorUpdateService
        var updateProductPromise = productUpdateService.update_product(sku, name, short_description, long_description, price, currency_id, vendor_id, quantity, product_family_id, small_image_path, standard_image_path, image_caption, is_active, is_include_shipping,tags,price_book_id,discount_price,res);
        updateProductPromise.then(function (result) {
          logger.info("End of update product function");
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occurred while updating the product info");
          // Returning the error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as required data not provided to update the product ##" + productInfo);
        res.status(400).send("Unable to update your product as required data is missing. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to update your product. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

// This function responds to the DELETE request to delete specific vendor profile (soft delete)
exports.delete_product = function (req, res) {

  try {
    if (req.body) {

      logger.info("Entered into the  delete_product function");

      var productInfo = JSON.stringify(req.body);
      // Parsing the request body
      var data = JSON.parse(productInfo),
        sku = data.sku,
        vendor_id = data.vendor_id,
        flag = data.delete;

      if (Boolean(flag) && Boolean(sku) && flag == "true" && Boolean(vendor_id)) {

        logger.info('Invoking the delete product Service.')

        var deleteProductPromise = productDeleteService.delete_product(sku, vendor_id, res);
        deleteProductPromise.then(function (result) {
          logger.info("End of delete_product function");
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occurred while deleting deleting product:: ");
          logger.info('End of delete_product function');
          // Returning the error response
          errorResponse;
        });
      }
      else {
        logger.error("Required info missed for deletion of product info" + sku + " " + vendor_id + " " + flag);
        res.status(400).send("Please provide sku, delete flag to delete product. Thank you for your business");
      }
    }
    else {
      logger.error("Required info missed for soft deletion of product info");
      res.status(400).send("Please provide required info to delete product. Thank you for your business");
    }
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to delete product info. Thank you for your business.")
  }
}

exports.currencies = function (req, res) {
  var currencyFetchService = require('../services/currencyFetchService'),
    header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    id = headerData.id,
    locale=headerData.locale;
  currencyFetchService.getCurrencies(locale,res).then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching currency");
    error;
  })
}

exports.productFamily = function (req, res) {
  var productFamilyFetchService = require('../services/productFamilyFetchService'),
    header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    id = headerData.id,
    locale=headerData.locale;
  productFamilyFetchService.getProductFamily("",locale, res).then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching productFamilies");
    error;
  })
}

exports.get_productFamily_by_vendor = function (req, res) {
  var productFamilyFetchService = require('../services/productFamilyFetchService'),
    id = req.query.id,
    header = JSON.stringify(req.headers),
    headerData = JSON.parse(header),
    locale= headerData.locale;
  if (Boolean(id)) {
    console.log("locale "+locale+" id "+id);
    productFamilyFetchService.getProductFamily(id,locale,res).then(data => {
      res.json(data);
    }, error => {
      logger.error("Error occured while fetching productFamilies");
      error;
    })
  }
  else {
    logger.error("Terminating the process as required data is missing to fetch the vendor product family ##");
    res.status(400).send("Unable to fetch your product families as required data is missing.")
  }
}

exports.book_slot = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into book_slot");

      var userInfo = JSON.stringify(req.body);

      var data = JSON.parse(userInfo);

      logger.info("parsing of request body completed");

      var name = data.name,
        phone = data.phone,
        email = data.email,
        attendies_count = data.attendies_count,
        date = data.date,
        time_slot = data.time_slot,
        vendor_id = data.vendor_id;

      // Getting the Phone as string
      if (!Boolean(email))
        data.email = "";

      // Mandatory check for product insert

      if (Boolean(name) && Boolean(phone) && Boolean(date) && Boolean(time_slot) && Boolean(vendor_id) && Boolean(attendies_count)) {
        // Invoking the product insert service

        var userLoadService = require('../services/userLoadService');

        var userLoadPromise = userLoadService.loadUser(data, res);
        userLoadPromise.then(function (result) {

          logger.info("End of book slot :: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while booking slot with the info ## " + data.name);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial user info provided for the booking ##");
        res.status(400).send("Unable to book your slot as required data is missing. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to book your slot. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

exports.fetchSlots = function (req, res) {
  var id = req.query.id,
  header = JSON.stringify(req.headers),
  headerData = JSON.parse(header),
  locale= headerData.locale;
  if (Boolean(id)) {
    var slotFetchService = require('../services/fetchSlotTimings');
    slotFetchService.getSlotTimings(id,locale,res).then(data => {
      res.json(data);
    }, error => {
      logger.error("Error occured while fetching slots");
      error;
    })
  }
  else {
    res.status(403).send("Please provide required info to fetch slots.");
  }
}

exports.confirmSlot = function (req, res) {
  var body = JSON.stringify(req.body),
    headerData = JSON.parse(body),
    id = headerData.vendor_id,
    booking_id = headerData.booking_id,
    date = headerData.date,
    status = headerData.status,
    timing = headerData.timing,
    name = headerData.name;

  if (Boolean(id) && Boolean(booking_id) && Boolean(date) && Boolean(status) && Boolean(timing) && Boolean(name)) {
 //   if(status=="false"&&Boolean(headerData.comments)){
    var slotConfirmService = require('../services/slotConfirmationService');
    slotConfirmService.notifySlot(id, booking_id, status, timing, name, date, res,headerData.comments).then(data => {
      res.json(data);
    }, error => {
      logger.error("Error occured while confirming slots");
      error;
    })
//  }
  /* else {
    res.status(403).send("Please provide comments for the slot rejection.");
  } */
  }
  else {
    res.status(403).send("Please provide required info to confirm the slot.");
  }
}

exports.confirmRegistration = function (req, res) {

  var code = req.query.code;

  var OAuthService = require('../services/OAuthService');
  OAuthService.ConfirmRegistration(code);

};

exports.add_product_family = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into create_product_family");

      var productInfo = JSON.stringify(req.body);

      var data = JSON.parse(productInfo);

      logger.info("parsing of request body completed");

      var name = data.name,
        vendor_id = data.vendor_id;

      // Mandatory check for product insert

      if (Boolean(name) && Boolean(vendor_id)) {
        // Invoking the product insert service

        var productFamilyLoadService = require('../services/ProductFamilyLoadService'),

          productLoadPromise = productFamilyLoadService.loadProductFamily(data, res);
        productLoadPromise.then(function (result) {

          logger.info("End of add_product_family :: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while adding the product-family with the info ## " + data.name);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial product info provided for the adding##");
        res.status(400).send("Unable to add your product-family as required data is missing. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your product-family. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

// This function responds to the DELETE request to delete specific vendor profile (soft delete)
exports.restore_product = function (req, res) {

  try {
    if (req.body) {

      logger.info("Entered into the restore_product function");

      var productInfo = JSON.stringify(req.body);
      // Parsing the request body
      var data = JSON.parse(productInfo),
        sku = data.sku,
        vendor_id = data.vendor_id;

      if (Boolean(sku) && Boolean(vendor_id)) {

        logger.info('Invoking the restore_product Service.')

        var restoreProductService = require('../services/productRestoreService'),
          restoreProductPromise = restoreProductService.restore_product(sku, vendor_id, res);
        restoreProductPromise.then(function (result) {
          logger.info("End of restore_product function");
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occurred while restore_product product:: ");
          logger.info('End of restore_product function');
          // Returning the error response
          errorResponse;
        });
      }
      else {
        logger.error("Required info missed for re-storing the product with info" + sku + " " + vendor_id + " " + flag);
        res.status(400).send("Please provide sku, vendor_id.");
      }
    }
    else {
      logger.error("Required info missed to re-store the product");
      res.status(400).send("Please provide required info to re-store product.");
    }
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to re-store product. Thank you for your business.")
  }
}

exports.getBookings_by_vendor = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into getBookings_by_vendor");

      var id = req.query.id;

      // Mandatory check for product insert

      if (Boolean(id)) {
        // Invoking the product insert service
        var fetchBookingsListService = require('../services/fetchBookingsList'),
          BookingListPromise = fetchBookingsListService.getBookingList(id, "", res);
        BookingListPromise.then(function (result) {

          logger.info("End of getBookings_by_vendor");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while getting bookings List of the vendor ## " + id);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial product info provided for the adding##");
        res.status(400).send("Unable to add your bookings list as required data is missing.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your bookings list. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};


exports.get_approved_vendor_bookings = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into get_approved_vendor_bookings");

      var id = req.query.id;

      // Mandatory check for product insert

      if (Boolean(id)) {
        // Invoking the product insert service
        var fetchBookingsListService = require('../services/fetchBookingsList'),
          BookingListPromise = fetchBookingsListService.getBookingList(id, "true", res);
        BookingListPromise.then(function (result) {

          logger.info("End of get_approved_vendor_bookings");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while getting bookings List of the vendor ## " + id);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial product info provided for the adding##");
        res.status(400).send("Unable to add your bookings list as required data is missing.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your bookings list. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

exports.get_rejected_vendor_bookings = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into getBookings_by_vendor");

      var id = req.query.id;

      // Mandatory check for product insert

      if (Boolean(id)) {
        // Invoking the product insert service
        var fetchBookingsListService = require('../services/fetchBookingsList'),
          BookingListPromise = fetchBookingsListService.getBookingList(id, "false", res);
        BookingListPromise.then(function (result) {

          logger.info("End of getBookings_by_vendor");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while getting bookings List of the vendor ## " + id);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial product info provided for the adding##");
        res.status(400).send("Unable to add your bookings list as required data is missing.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your bookings list. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

exports.signup = function (req, res) {

  var OAuthService = require('../services/OAuthService');
  var vendor = JSON.stringify(req.body);
  // Parsing the request body
  var data = JSON.parse(vendor),
    email = data.email,
    phone = data.phone,
    userName = data.userName,
    password = data.password;
  var authPromise = OAuthService.register(email, phone, userName, password);
  authPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
};

exports.confirmSignIn = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  var vendor = JSON.stringify(req.body);
  // Parsing the request body
  var data = JSON.parse(vendor),
    email = data.email,
    phone = data.phone,
    userName = data.userName,
    password = data.password,
    code = data.code;
  var oAuthPromise = OAuthService.ConfirmRegistration(code, userName);
  oAuthPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
};


exports.signin = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  // OAuthService.login();
  var vendor = JSON.stringify(req.body);
  // Parsing the request body
  var data = JSON.parse(vendor),
    email = data.email,
    phone = data.phone,
    userName = data.userName,
    password = data.password;
  var oAuthPromise = OAuthService.login(userName, password);
  oAuthPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
};

exports.signOut = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  // OAuthService.login();
  var vendor = JSON.stringify(req.body);
  // Parsing the request body
  var data = JSON.parse(vendor),
    email = data.email,
    phone = data.phone,
    userName = data.userName,
    password = data.password;
  var oAuthPromise = OAuthService.signout(userName);
  oAuthPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
exports.process_Order = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  // OAuthService.login();
  var result = JSON.stringify(req.body),
  order=JSON.parse(result);
  // Parsing the request body
  if (Boolean(order.customer.billing.name) &&
    Boolean(order.customer.billing.phone) &&
    Boolean(order.customer.billing.email) &&
    Boolean(order.customer.billing.country) &&
    Boolean(order.customer.billing.state) &&
    Boolean(order.customer.billing.city) &&
    Boolean(order.customer.billing.zip) &&
    Boolean(order.customer.billing.address) &&
    Boolean(order.customer.shipping.name) &&
    Boolean(order.customer.shipping.phone) &&
    Boolean(order.customer.shipping.email) &&
    Boolean(order.customer.shipping.country) &&
    Boolean(order.customer.shipping.state) &&
    Boolean(order.customer.shipping.city) &&
    Boolean(order.customer.shipping.zip) &&
    Boolean(order.customer.shipping.address) &&
    Boolean(order.order.products.length) &&
    Boolean(order.order.created_date) &&
    Boolean(order.order.total_price) &&
    Boolean(order.order.outlet.qr_code) &&
    Boolean(order.order.outlet.name) &&
    Boolean(order.order.outlet.vendor_name) &&
    Boolean(order.order.outlet.vendor_phone) &&
    Boolean(order.order.outlet.vendor_mail)){
    var orderService = require('../services/orderService');
  var orderPromise = orderService.order(order, res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to book order! as required data is missing for order booking");
}
}

exports.getOrderList = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  // OAuthService.login();
  var id = req.query.id;
  // Parsing the request body
  if (Boolean(id)){
    var orderService = require('../services/fetchOrderList');
  var orderPromise = orderService.getOrderList(id,"true",res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to fetch orders! as required data is missing for fetching orders");
}
}

exports.getOrderDetails = function (req, res) {
  var OAuthService = require('../services/OAuthService');
  // OAuthService.login();
  var id = req.query.id;
  // Parsing the request body
  if (Boolean(id)){
    var orderService = require('../services/orderFetchService');
  var orderPromise = orderService.getOrderDetails(id,"true",res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to fetch orders! as required data is missing for fetching orders");
}
}

exports.remindOrderPayment = function (req, res) {
  var data=JSON.stringify(req.body),
  data=JSON.parse(data);
  // Parsing the request body
  if (Boolean(data.order_id)){
    var paymentReminderService = require('../services/paymentReminderService');
  var orderPromise = paymentReminderService.paymentReminder(data,res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to send Payment Reminder! as required data is missing.");
}
}

exports.updateOrderPayment = function (req, res) {
  var data=JSON.stringify(req.body),
  data=JSON.parse(data);
  // Parsing the request body
  if (Boolean(data.order_id)&&Boolean(data.payment_type)&&Boolean(data.payment_status)&&Boolean(data.updated_date)){
    if(data.payment_status.name=="Rejected"&&(data.payment_notes==""||data.payment_notes==undefined)){
      res.status(400).send("Unable to update Payment status! as payment notes is required for the rejection.");
}
else{
  if(data.payment_status.name=="Pending")
  res.status(400).send("Unable to update Payment status! Please choose valid payment status.");
  else{
  var paymentUpdateService = require('../services/paymentUpdateService');
  var orderPromise = paymentUpdateService.updatePaymentStatus(data,res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
}
}
else{
  res.status(400).send("Unable to update Payment status! as required data is missing.");
}
}

exports.updateShipmentDetails= function (req, res) {
  var data=JSON.stringify(req.body),
  data=JSON.parse(data);
  // Parsing the request body
  if (Boolean(data.order_id)&&Boolean(data.shipment_type)&&Boolean(data.shipment_tracking)&&Boolean(data.updated_date)){
    var shipmentUpdateService = require('../services/orderFulfillmentService');
  var orderPromise = shipmentUpdateService.updateShipment(data,res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to update shipment details! as required data is missing.");
}
}

exports.paymentType = function (req, res) {
  var paymentTypeFetchService = require('../services/paymentTypeFetchService');
  paymentTypeFetchService.getPaymentType().then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching payment types");
    error;
  })
}

exports.paymentStatus = function (req, res) {
  var paymentStatusFetchService = require('../services/paymentStatusFetchService');
  paymentStatusFetchService.getPaymentStatus().then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching payment status");
    error;
  })
}

exports.orderStatus = function (req, res) {
  var orderStatusFetchService = require('../services/orderStatusFetchService');
  orderStatusFetchService.getOrderStatus().then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching order status");
    error;
  })
}

exports.shipmentType = function (req, res) {
 var shipmentTypeFetchService = require('../services/shipmentTypeFetchService');
  shipmentTypeFetchService.getShipmentType().then(data => {
    res.json(data);
  }, error => {
    logger.error("Error occured while fetching shipment type");
    error;
  })
 /*  var data=18.9;
  var results=data.toFixed(2);
  res.send(results); */
}

exports.updateOrderStatusDetails= function (req, res) {
  var data=JSON.stringify(req.body),
  data=JSON.parse(data);
  // Parsing the request body
  if (Boolean(data.order_id)&&Boolean(data.notes)&&Boolean(data.updated_date)&&Boolean(data.status)){
    var orderStatusUpdateService = require('../services/orderStatusUpdateService');
  var orderPromise = orderStatusUpdateService.updateOrderStatus(data,res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to update order status details! as required data is missing.");
}
}

exports.loadStates = function (req, res) {

  try {
    var s3BucketName = req.query['bucket-name'],
      fileName = req.query['file-name'],
      statesUtil = require('../utils/LoadStateUtil'), loadStatesintoDB = require('../utils/loadStatesintoDB');
      statesUtil.getStatesFromExcel(s3BucketName, fileName).then(result => {
      var states = result;
      loadStatesintoDB.loadStates(states).then(status => {
        logger.info("Successfully loaded the states into DB");
        res.send(status);
      }, failed => {
        logger.error("Error occured :" + failed)
        res.status(500).send(failed);
      })
    },
      failed => {
        logger.error("Error occured :" + failed);
        res.status(500).send("Unable to get Excel Data");
      })
  }
  catch (error) {
    logger.error("Error occured ::" + error);
  }
}

exports.loadCities = function (req, res) {

  try {
    var s3BucketName = req.query['bucket-name'],
      fileName = req.query['file-name'],
      citiesUtil = require('../utils/LoadCityUtil'), loadCitiesintoDB = require('../utils/loadCitiesintoDB');
      citiesUtil.getCitiesFromExcel(s3BucketName, fileName).then(result => {
      var cities = result;
      loadCitiesintoDB.loadCities(cities).then(status => {
        logger.info("Successfully loaded the cities into DB");
        res.send(status);
      }, failed => {
        logger.error("Error occured :" + failed)
        res.status(500).send(failed);
      })
    },
      failed => {
        logger.error("Error occured :" + failed);
        res.status(500).send("Unable to get Excel Data");
      })
  }
  catch (error) {
    logger.error("Error occured ::" + error);
  }
}

exports.add_price_book = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into add_price_book");

      var priceBookInfo = JSON.stringify(req.body);

      var data = JSON.parse(priceBookInfo);

      logger.info("parsing of request body completed");

      var vendor_id = data.vendor_id,
        gst_number=data.gst_number,
        gst_percent=data.gst_slab_id;
      // Mandatory check for product insert

      if (Boolean(gst_number) && Boolean(vendor_id) && Boolean(gst_percent)) {
        // Invoking the product insert service

        var priceBookLoadService = require('../services/priceBookLoadService'),

        priceBookLoadPromise = priceBookLoadService.loadPriceBook(data, res);
        priceBookLoadPromise.then(function (result) {

          logger.info("End of add_price_book:: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while adding the price-book with the info ## " + data.name);
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial priceBook nfo provided for the adding##");
        res.status(400).send("Unable to add your price-book as required data is missing. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to add your price-book. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

exports.create_vendor_alias = async function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into create_vendor_alias");

      var vendorInfo = JSON.stringify(req.body);

      var data = JSON.parse(vendorInfo);
      var header = JSON.stringify(req.headers),
      headerData = JSON.parse(header),
      locale = headerData.locale;

      logger.info("parsing of request body completed");

      // Getting the Vendor Info
       //company_name = data.company_name,
       var name = data.name,
        email = data.email,
     //    categories = data.categories,
        phone = data.phone,
    //    company_address = data.company_address,
    //    country = data.country,
    //    state = data.state,
    //    city = data.city,
    //    zipcode = data.zipcode,
     //   languagesPreferred = data.languagesPreferred,
        submittedDate = data.submittedDate,
        vendor_id=data.vendor_id,
        created_by=data.created_by,
        privacy_mode=data.privacy_mode;
      // Getting the Phone as string
      if (Boolean(phone))
        phone = phone + "";

      // Mandatory check for vendor Registration
      if(data.is_payment_contact=="true"&&!Boolean(data.payment_method)){
        logger.error("Terminating the process as partial vendor alias info provided for the registration ##" + data);
        if("te_IN"==locale)
        res.status(400).send("అవసరమైన డేటా లేనందున మీ సమాచారాన్ని సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు.")
        else
        res.status(400).send("Unable to submit your information as payment_method is missing for payment contact.")
      }

     else if (Boolean(name) && Boolean(phone) && Boolean(email) && Boolean(submittedDate)&&Boolean(vendor_id)&&Boolean(created_by)&&("no"==privacy_mode||"yes"==privacy_mode)) {

        // Invoking the Register Servic

        var vendorAliasRegisterService=require('../services/vendorAliasRegisterService');
        var vendorAliasRegisterPromise = vendorAliasRegisterService.registerVendorAlias(data,locale,res);
        vendorAliasRegisterPromise.then(function (result) {

          logger.info("End of create_vendor_alias :: ");

          res.json(result);

        }, function (errorResponse) {
          logger.error("Error occurred while registering the vendor alias with the info ## ");
          // Sending the Error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as partial vendor alias info provided for the registration ##" + data);
        if("te_IN"==locale)
        res.status(400).send("అవసరమైన డేటా లేనందున మీ సమాచారాన్ని సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు.")
        else
        res.status(400).send("Unable to submit your information as required data is missing. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    if("te_IN"==locale)
    res.status(500).send("అంతర్గత సర్వర్ లోపం! మీ ప్రొఫైల్‌ను సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు.")
    else
    res.status(500).send("Internal Server Error! Unable to submit alias profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

// This function responds to the PUT request to update the vendor profile
exports.update_vendor_alias = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into the update_vendor_alias function")

      var vendorInfo = JSON.stringify(req.body);

      // Parsing the request body
      var data = JSON.parse(vendorInfo);

      // Getting the Vendor Info
      var qrCode = data.qrCode,
      //  company_name = data.company_name,
        name = data.name,
        email = data.email,
      //  categories = data.categories,
        phone = data.phone,
      //  company_address = data.company_address,
      //  country = data.country,
      //  state = data.state,
      //  city = data.city,
      //  languagesPreferred = data.languagesPreferred,
      //  submittedDate = data.submittedDate,
        updatedDate = data.updatedDate,
      //  site = data.site,
        isApproved = data.isApproved,
        comments = data.comments,
        updated_by=data.updated_by,
        privacy_mode=data.privacy_mode;
      //  zipcode = data.zipcode,
      //  price_book_id=data.price_book_id;
      // Getting the Phone as string
      if (Boolean(phone))
        phone = phone + "";

      // Setting default values to isApproved and Comments if not provided
      if (isApproved != true && isApproved != false)
        isApproved = true;
      if (!Boolean(comments))
        comments = "";

      // Check on required Data  
      if (Boolean(qrCode) && Boolean(name) && Boolean(updatedDate) && Boolean(phone) && Boolean(email)&& Boolean(updated_by)&& ("no"==privacy_mode||"yes"==privacy_mode)) {

        var vendorAliasUpdateService=require('../services/vendorAliasUpdateService');
        
        // Invoking the VendorUpdateService
        var updateVendorPromise = vendorAliasUpdateService.update_vendor_alias(qrCode,name, email,phone,updatedDate,isApproved,comments,data.is_admin,data.is_outlet_display,data.is_payment_contact,updated_by,privacy_mode,res);
        updateVendorPromise.then(function (result) {
          logger.info("End of update vendor function");
          res.json(result);
        }, function (errorResponse) {
          logger.error("Error occurred while updating the vendor profile");
          // Returning the error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as required data (email/phone/qrCode) not provided to update the vendor ##" + vendorInfo);
        res.status(400).send("Unable to update your information as required data is missing. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
      }
    }
  }// end of try
  catch (error) {
    console.log(error);
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to update your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
};

exports.send_vendor_alias_code = function (req, res) {

  try {

    //importing the required dependencies

    if (req.body) {

      logger.info("Entered into verify_vendor_alias function");

      var Data = JSON.stringify(req.body),
        vendorData = JSON.parse(Data),
        id = vendorData.id,
        isPhone = false,

        // Phone validation
        phonePattern = /^\d{10}$/;

      if (Boolean(id)) {
        if (id.match(phonePattern)) {
          isPhone = true;
          logger.info("Provided mobile number for OTP");
        }
        else {
          isPhone = false;
          logger.info("Provided email for OTP");
        }

        var aliasVerifyService=require('../services/vendorAliasVerifyService'),

        otpServicePromise = aliasVerifyService.vendor_alias_verify(id, res, isPhone);

        otpServicePromise.then(function (result) {

          res.json(result);

        }, function (errorResponse) {

          logger.error("Error occured while sending Verification code ::");

          // returning the error response
          errorResponse;

        });
      }

      else {
        logger.error("Unable to send verification code as mail is missing");
        res.status(400).send("Unable to send Verification code. Please provide your registered email/mobile number. Thank you for your business.")
      }

      logger.info("End of verify vendor alias function");

    }

  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to send verification code. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }

}

exports.verify_vendor_alias = function (req, res) {

  try {

    if (req.body) {

      logger.info("Entered into verify_vendor_alias function");

      var Data = JSON.stringify(req.body),

        vendorData = JSON.parse(Data),
        header = JSON.stringify(req.headers),
        headerData = JSON.parse(header),
        locale = headerData.locale,
        id = vendorData.id,
        otp = vendorData.otp,
        //    isVendor= vendorData.isVendor,
        isPhone = false,
        // Phone validation
        phonePattern = /^\d{10}$/;

      if (Boolean(id) && Boolean(otp)) {

        if (id.match(phonePattern))
          isPhone = true;

          var vendorAliasVerify=require('../services/vendorAliasVerifyService'),
        // Fetching the vendor based on Search param
         vendorFetchPromise = vendorAliasVerify.verify_vendor_alias(id, otp, isPhone,locale, res);
        vendorFetchPromise.then(function (vendor) {
          res.json(vendor);
        }, function (errorResponse) {
          logger.error("Error occured while verifying the vendor alias");
          // returning error response
          errorResponse;
        })
      }
      else {
        logger.error("Terminating the process as required data not provided to verify the vendor alias")
        res.status(400).send("Please provide verification code and registered email/phone to verify. For quick response, please reach our support team at Contact Us. Thank you for your business.");
      }

    }
  }//end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    res.status(500).send("Internal Server Error! Unable to verify your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business.")
  }
}

exports.fetch_price_book_by_vendor = function (req, res) {

   var vendor_id= req.query.id;
  // Parsing the request body
  if (Boolean(vendor_id)){
    var orderStatusUpdateService = require('../services/priceBookFetchService');
  var orderPromise = orderStatusUpdateService.getPriceBook(vendor_id,res);
  orderPromise.then(result => {
    res.json(result);
  }, error => {
    error;
  })
}
else{
  res.status(400).send("Unable to fetch price_book! as required data is missing.");
}
  }

  exports.fetch_gst_slabs = function (req, res) {

   // Parsing the request body
     var gstSlabFetchService = require('../services/gstSlabFetchService');
   var orderPromise = gstSlabFetchService.getSlabs(res);
   orderPromise.then(result => {
     res.json(result);
   }, error => {
     error;
   })

   }

   exports.fetch_alias_list_by_vendor = function (req, res) {

    var id=req.query.id;
    // Parsing the request body
    var aliasFetchService = require('../services/fetchAliasListService');
    var orderPromise = aliasFetchService.getAliasList(id,res);
    orderPromise.then(result => {
      res.json(result);
    }, error => {
      error;
    })
 
    }
'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var vendorUtils = require('../utils/vendorUtil'),
  mailUtil = require('../utils/mailUtil'),  //importing the mail util
  logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the vendor info into the DB 
 to register the vendor*/

exports.registerVendor = async function (vendor,locale,response) {

  try {

    logger.info("Entered into registerVendor function");

    var vendor_qrCode = vendorUtils.vendorQR(),
      vendor_token = vendorUtils.vendorID(),
      db_vendor = db.vendor;

    /** This function creates the vendor in DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */
   return new Promise(function (resolve, reject) {

    db.vendorAlias.findOne({
      where: {
        [op.or]: [{
          email: {
            [op.eq]: vendor.email
          }
        }, {
          phone: {
            [op.eq]: vendor.phone
          }
        }
        ]
      }
    }
    ).then(tempVendor => {
      if(null==tempVendor){
        db_vendor.findOrCreate({
          // Check for the duplicate vendor with the provided phone and email
          where: {
            [op.or]: [{
              email: {
                [op.eq]: vendor.email
              }
            }, {
              phone: {
                [op.eq]: vendor.phone
              }
            },{
              phone: {
                [op.eq]: vendor.phone
              }
            }
            ]
          },
          // Vendor data that needs to be inserted in DB if not already exists 
          defaults: {
            qr_code: vendor_qrCode, //generated qr code
            company_name: vendor.company_name,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            company_address: vendor.company_address,
            site: vendor.site,
            is_approved: true,
            comments: "",
            token: vendor_token, //generated token
            secret_key: "",
            timestamp: 0,
            category: vendor.categories.join(","), // Converting the category array to string of comma (,) seperated values
            language: vendor.languagesPreferred.join(","), // Converting the language array to string of comma (,) seperated values
            submitted_date: vendor.submittedDate,
            updated_date: vendor.updatedDate,
            zip_code: vendor.zipcode,
            country_id: vendor.country,
            state_id: vendor.state,
            city_id: vendor.city,
            price_book_id:vendor.price_book_id
          }
        }).then(status=>{
          if (status[1]) {
            // Sending the confirmation mail to the vendor
            logger.info("vendor inserted/created successfully");
            mailUtil.sendMail(vendor.email, vendor_qrCode, vendor.name, "", "", "", true, false, "");
            if("te_IN"==locale)
            resolve("నమోదు చేసినందుకు ధన్యవాదాలు. మీరు త్వరలో నిర్ధారణ ఇమెయిల్‌ను అందుకుంటారు. మా బృందంలో ఒకరు త్వరలో మీతో సంప్రదిస్తారు. మీ వ్యాపారానికి ధన్యవాదాలు.");
            else
            resolve("Thank you for registering. You should receive a confirmation email shortly. One of our team will be in contact with you soon. Thank you for your business.");
          }
          else{
            logger.error("vendor already exists with the provided info ::phone/email" + vendor.phone + "/" + vendor.email);
            if("te_IN"==locale)
            reject(response.status(409).send("ఈ వివరాలతో ఇప్పటికే ఒక విక్రేత నమోదు చేసుకున్నాడు, క్రొత్త రిజిస్ట్రేషన్ కోసం మీ ఫోన్ లేదా ఇమెయిల్ మార్చండి లేదా దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు."));
            else
            reject(response.status(409).send("A vendor already registered with these details, change your phone or email for new registration or please reach our support team at Contact Us. Thank you for your business."));
          }
    
          logger.info("End of registerVendor function");
        });
      }else{
        logger.error("vendor alias already exists with the provided info ::phone/email" + vendor.phone + "/" + vendor.email);
            if("te_IN"==locale)
            reject(response.status(409).send("ఈ వివరాలతో ఇప్పటికే ఒక విక్రేత నమోదు చేసుకున్నాడు, క్రొత్త రిజిస్ట్రేషన్ కోసం మీ ఫోన్ లేదా ఇమెయిల్ మార్చండి లేదా దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు."));
            else
            reject(response.status(409).send("A vendor alias already registered with these details, change your phone or email for new registration or please reach our support team at Contact Us. Thank you for your business.")); 
      }
    });
  });
  }

  catch (err) {

    logger.error("Error occured while registering the user ::" + err);

    if("te_IN"==locale)
    reject(response.status(500).send("అంతర్గత సర్వర్ లోపం! మీ ప్రొఫైల్‌ను సమర్పించడం సాధ్యం కాలేదు. మా ఏజెంట్ ఒకరు త్వరలో మిమ్మల్ని చేరుకుంటారు. శీఘ్ర ప్రతిస్పందన కోసం, దయచేసి మా మద్దతు బృందాన్ని సంప్రదింపు పేజీ  ద్వారా చేరుకోండి. మీ వ్యాపారానికి ధన్యవాదాలు."));
    else
    reject(response.status(500).send("Internal Server Error! Unable to submit your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
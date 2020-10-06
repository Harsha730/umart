'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { vendor, customer, vendor_plan } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

exports.vendorPlanPaymentReminder = function (data,res) {
  try {
    var plan_id=data.id,email=data.vendor_email,phone=data.vendor_phone,name=data.vendor_name;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the planUpdateService");
      db.vendor_plan.findOne({
        where: {
          id: {
            [op.eq]: plan_id //Fetching the vendor_plan with the plan_id
          }
        },
        include:[{
          model:db.plan
        }]
      }).then(plan => {
        if (null != plan) {
          var price=plan.plan.currency_code+" "+plan.plan.price,
          monthUtil=require('../utils/monthUtil'),
          month=monthUtil.getMonthName(new Date().getMonth());
          logger.info("Found the plan to update ");
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
      //    plan.update({status: status}).then(status => {
            resolve("Payment reminder sent successfully!.");
        //    if(status=="true"||true==status){
              var vendorPlanPaymentReminderMail=require('../utils/vendorPlanPaymentReminderMail');
              vendorPlanPaymentReminderMail.paymentReminder(email,name,price,month,plan.plan.name,plan_id);
      //      }else{
      //      }
     //     });
        } else {
          logger.error("Plan not found in the DB with the plan_id #" + plan_id);
          reject(res.status(404).send("Unable to send payment reminder as no plan matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to send payment reminder. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to send payment reminder. Thank you for your business."));
  }
}
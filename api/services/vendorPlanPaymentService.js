'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { vendor, customer, vendor_plan } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

exports.vendorPlanPaymentService= function (data,res) {
  try {
    var plan_id=data.id,email=data.vendor_email,phone=data.vendor_phone,name=data.vendor_name;
    return new Promise(function (resolve, reject) {
      logger.info("Entered into the vendorPlanPaymentService");
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
          updated_date=new Date(),
          monthUtil=require('../utils/monthUtil'),
          month=monthUtil.getMonthName(new Date().getMonth()),
        //  today=new Date(),
            priorDate=new Date().setDate(updated_date.getDate()+29),
            updated_date=updated_date.toJSON(),
            end_date=new Date(priorDate);
            end_date=end_date.toJSON().toString();
          logger.info("Found the plan to update payment status");
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data 
          plan.update({start_date:updated_date,end_date:end_date,payment_status: "Paid",payment_updated_date:updated_date}).then(status => {
            resolve("Payment status updated successfully!.");
        //    if(status=="true"||true==status){
              var vendorPlanPaymentConfirmationMail=require('../utils/vendorPlanPaymentConfirmationMail');
              vendorPlanPaymentConfirmationMail.sendPaymentConfirmation(email,name,price,month,plan.plan.name);
      //      }else{
      //      }
         });
        } else {
          logger.error("Plan not found in the DB with the plan_id #" + plan_id);
          reject(res.status(404).send("Unable to update payment status as no plan matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to update payment status. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to update payment status. Thank you for your business."));
  }
}
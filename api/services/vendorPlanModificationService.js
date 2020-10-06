'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { vendor, customer } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

exports.planUpdateService = function (data,res) {
  try {
    var plan_id=data.id,status=data.status,email=data.vendor_email,phone=data.vendor_phone,name=data.vendor_name,temp_status=data.status;
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
      //    console.log(plan);
          var plan_name=plan.plan.name;
          logger.info("Found the plan to update ");
          // Passing the single JSON object with the vendor info that to be updated with key as DB column names and values as vendor data
          var today=new Date(),
            priorDate=new Date().setDate(today.getDate()+29),
            end_date=new Date(priorDate),
            temp_update_date=plan.payment_updated_date;
            end_date=end_date.toJSON().toString();
      //      console.log(temp_update_date);
         var start_date=today.toJSON().toString();
         if(false==status){
           start_date=plan.start_date;
           end_date=plan.end_date;
         }

         console.log("status ::"+temp_status)

         plan.update({is_active: status,start_date:start_date,end_date:end_date,updated_date:start_date}).then(status => {
            resolve("Plan status has been updated successfully!.");
            if(temp_status==true&&(temp_update_date!="trail-period"&&temp_update_date!="")){
              var PlanStatusUpdateMail=require('../utils/PlanStatusUpdateMail'),
              moment = require('moment'),
              phoneUtils= require('../utils/phoneUtil'),
              data=moment(end_date).format('MMMM Do YYYY, h:mm:ss a');
              PlanStatusUpdateMail.notifyStatus(email,name,data);
              phoneUtils.sendPlanActivationConfirmation(plan_name,phone);
            }else if(temp_status==true&&(temp_update_date=="trail-period"||temp_update_date=="")){
              var vendorTrailPlanActivateMail=require('../utils/vendorTrailPlanActivateMail'),
              moment = require('moment'),
              data=moment(end_date).format('MMMM Do YYYY, h:mm:ss a');
              vendorTrailPlanActivateMail.notifyStatus(email,name,data);
            }
            else {
              var PlanDeactivatedStatusUpdateMail=require('../utils/PlanDeactivatedStatusUpdateMail'),
              phoneUtils= require('../utils/phoneUtil');
              PlanDeactivatedStatusUpdateMail.notifyStatus(email,name);
              phoneUtils.sendPlanDeActivateConfirmation(phone);
            }
          });
        } else {
          logger.error("Plan not found in the DB with the plan_id #" + plan_id);
          reject(res.status(404).send("Unable to update plan status as no plan matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
      }).catch(error => {
        logger.error("Error occured::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to update plan status. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      });
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to update plan status. Thank you for your business."));
  }
}
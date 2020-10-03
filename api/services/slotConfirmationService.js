'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger

exports.notifySlot= function (id,booking_id,status,timing,name,date,response,comments) {

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into notifySlot function");

      // This function fetches all the countries
      db.user.findOne({
        where: {
             [op.and]:[{booking_id: {
                [op.eq]: booking_id //Fetching the user
              },vendor_id :{
                [op.eq]: id
              }}]
            },
        include:[{
          model:db.vendor,
          include:[
            {
              model : db.country
            },
            {
              model : db.state
            },
            {
              model : db.city
            },
          ]
        }]
      }).then(user => {
        if (null == user) {
          logger.error("user not found in the DB");
          reject(response.status(404).send("Unable to notify user as user not found."));
        }
        else {
            var phoneUtil=require('../utils/phoneUtil');
            if(status=="true"){
            user.update({user_status: status}).then(result=>{
             //   phoneUtil.sendSlotConfirmation(user.booking_id,name,timing,user.phone,status,date);
                resolve('Slot has been approved successfully!');
                if(Boolean(user.email)){
                var slotConfirmationEmail=require('../utils/slotConfirmationEmail');
                slotConfirmationEmail.slotConfirmationEmail(user.email,user.name,user.attendies_count,user.vendor,booking_id,date,timing);
                }
              })
            }
            if(status=="false"){
              if(!Boolean(comments))
              comments="The selected time slot has no availability during peak times. Slots are confirmed based on first in first serve basis.";
              user.update({user_status: status,comments:comments}).then(result=>{
            // phoneUtil.sendSlotConfirmation(user.booking_id,name,timing,user.phone,status,date);
              resolve('Slot has been rejected successfully!');
              if(Boolean(user.email)){
                var slotRejectionEmail=require('../utils/slotRejectionEmail');
                slotRejectionEmail.slotRejectionEmail(user.email,user.name,comments,user.vendor,booking_id,date,timing);
              }
          })
        }
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while sending confirmation to user");
        reject(response.status(500).send("Internal Server Error! Unable to send confirmation to user."));
      })

      logger.info("End of getCities function");
      
    }
    catch (err) {
      logger.error("Error occured while notifying the Slot::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to notify the user."));
    }
  })
}


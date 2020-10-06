'use strict';

// importing all the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;
var vendorUtil = require('../utils/vendorUtil'),
  logger = require('../config/winston_Logger');

logger = logger(module) // Passing the module to the logger

/* This service contains the logic, to save the product info into the DB 
 to load the product*/

exports.loadUser = async function (data, response) {

  try {

    logger.info("Entered into loadUser function");

    /** This function creates the vendor in DB with the provided data if not already exists 
     * And returns the vendor if exists already
    */

return new Promise(function (resolve, reject) {

    var id = vendorUtil.userID(),
      user = db.user;
      
    user.findAll({
      where: {
        [op.and]: [{
          time_slot: {
            [op.eq]: data.time_slot
          }
        }, {
          phone: {
            [op.eq]: data.phone
          }
         }]
      },
    }).then(users=>{
      var is_duplicate=false;
      console.log("test ::"+new Date('Thu Jul 16 2020').toDateString());
      users.forEach(user => {
        if(new Date(user.date).toDateString()==new Date(data.date).toDateString())
        is_duplicate=true;
      });
      if(!is_duplicate)
        db.user.create({
          booking_id: id,
          name:data.name,
          phone:data.phone,
          email:data.email,
          attendies_count:data.attendies_count,
          date:data.date,
          time_slot:data.time_slot,
          vendor_id:data.vendor_id,
          user_status:'Pending',
          status:false
        }).then(results=>{
          logger.info("user inserted successfully");
          var slotBookingMail=require('../utils/slotBookingEmail');
          slotBookingMail.slotBookingMail(data.vendor_mail,data.vendor_name,id,new Date(data.date).toDateString(),data.time,data.attendies_count,data.outlet_name,data.name,data.phone);
          resolve('Your slot has been booked successfully! Thank you for your business.');
        } ,error=>{
          console.log(error);
          logger.error("user already exists with the provided info ::phone/email");
          reject(response.status(500).send("Internal Error! Unable to book your slot. Thank you for your business."));
      })
      else {
        logger.error("slot already booked with the provided info ::name/vendor_id ::");
        reject(response.status(409).send("You have already booked a slot in the specified slot timing, Please change your slot timings for new booking."));
    }
    })
      
    logger.info("End of load product function");

});

  }

  catch (err) {

    logger.error("Error occured while booking the slot " + err);

    reject(response.status(500).send("Internal Server Error! Unable to book your slot. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));

  }
}
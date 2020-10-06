'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'),
    path = require('app-root-path');
const { states } = require('../controllers/vendorController');
const { data } = require('../config/db.config');

logger = logger(module); // Passing the module to the logger

exports.sendOTP = function (phone, otp) {
    try {

        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

        var AWS = require('aws-sdk'),
            appId = props.get('pin_point.app_id'),
            type = props.get('pin_point.message_type'),
            senderId = props.get('pin_point.sender_id'),
            ChannelType = props.get('pin_point.channel_type'),
            filePath = `${path}/api/config/config.json`;

        AWS.config.loadFromPath(filePath);

        // The content of the SMS message.
        var message = otp + " is your Umart44 OTP. Do not share it with anyone.",
            applicationId = appId,
            messageType = type,
            senderId = senderId,
            destinationNumber = phone;

        //Create a new Pinpoint object.
        var pinpoint = new AWS.Pinpoint();

        // Specify the parameters to pass to the API.
        var params = {
            ApplicationId: applicationId,
            MessageRequest: {
                Addresses: {
                    [destinationNumber]: {
                        ChannelType: ChannelType
                    }
                },
                MessageConfiguration: {
                    SMSMessage: {
                        Body: message,
                        MessageType: messageType,
                        SenderId: senderId,
                    }
                }
            }
        };

        //Try to send the message.
        pinpoint.sendMessages(params, function (err, data) {
            // If something goes wrong, print an error message.
            if (err) {
                logger.error("Unable to send OTP " + err);
            } else {
                logger.info("OTP sent successfully!");
            }
        });

    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}

exports.sendSlotConfirmation = function (booking_id,name,timing,phone,status,date) {
    
    try {

        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

        var AWS = require('aws-sdk'),
            appId = props.get('pin_point.app_id'),
            type = props.get('pin_point.message_type'),
            senderId = props.get('pin_point.sender_id'),
            ChannelType = props.get('pin_point.channel_type'),
            filePath = `${path}/api/config/config_updated.json`;

        AWS.config.loadFromPath(filePath);

        var result="";
        if(status=="true")
        result="Hello! Your slot has been confirmed with "+name+" at "+timing+" on "+new Date(date).toDateString()+". Your booking id is:"+booking_id;
        else if(status=="false")
        result="Hello! Your slot has been rejected with "+name+" at "+timing+" on "+new Date(date).toDateString()+".";
        // The content of the SMS message.
        var message = result,
            applicationId = appId,
            messageType = type,
            senderId = senderId,
            destinationNumber = phone;

        //Create a new Pinpoint object.
        var pinpoint = new AWS.Pinpoint();

        // Specify the parameters to pass to the API.
        var params = {
            ApplicationId: applicationId,
            MessageRequest: {
                Addresses: {
                    [destinationNumber]: {
                        ChannelType: ChannelType
                    }
                },
                MessageConfiguration: {
                    SMSMessage: {
                        Body: message,
                        MessageType: messageType,
                        SenderId: senderId,
                    }
                }
            }
        };

        console.log("status ::"+status);

        //Try to send the message.
        pinpoint.sendMessages(params, function (err, data) {
            // If something goes wrong, print an error message.
            if (err) {
                logger.error("Unable to send OTP " + err);
            } else {
                console.log("data ::"+data);
               // logger.info("OTP sent successfully!"+data);
            }
        });

    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}

exports.sendPlanActivationConfirmation = function (plan_type,phone) {
    
    try {

        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

        var AWS = require('aws-sdk'),
            appId = props.get('pin_point.app_id'),
            type = props.get('pin_point.message_type'),
            senderId = props.get('pin_point.sender_id'),
            ChannelType = props.get('pin_point.channel_type'),
            filePath = `${path}/api/config/config_updated.json`;

        AWS.config.loadFromPath(filePath);

        var result="Dear customer, thank you for subscribing to "+plan_type+" membership plan on Umart44. Your account has activated now, and it is ready to use merchandising provisioning.";
        // The content of the SMS message.
        var message = result,
            applicationId = appId,
            messageType = type,
            senderId = senderId,
            destinationNumber = phone;

        //Create a new Pinpoint object.
        var pinpoint = new AWS.Pinpoint();

        // Specify the parameters to pass to the API.
        var params = {
            ApplicationId: applicationId,
            MessageRequest: {
                Addresses: {
                    [destinationNumber]: {
                        ChannelType: ChannelType
                    }
                },
                MessageConfiguration: {
                    SMSMessage: {
                        Body: message,
                        MessageType: messageType,
                        SenderId: senderId,
                    }
                }
            }
        };

    //    console.log("status ::"+status);

        //Try to send the message.
        pinpoint.sendMessages(params, function (err, data) {
            // If something goes wrong, print an error message.
            if (err) {
                logger.error("Unable to send Plan Activated SMS " + err);
            } else {
               // console.log("data ::"+data);
                logger.info("Plan Activated SMS sent successfully!"+data);
            }
        });

    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}

exports.sendPlanDeActivateConfirmation = function (phone) {
    
    try {

        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

        var AWS = require('aws-sdk'),
            appId = props.get('pin_point.app_id'),
            type = props.get('pin_point.message_type'),
            senderId = props.get('pin_point.sender_id'),
            ChannelType = props.get('pin_point.channel_type'),
            filePath = `${path}/api/config/config_updated.json`;

        AWS.config.loadFromPath(filePath);

        var result="Dear customer, your umart44 account has been temporarily disabled. If you have any questions or concerns, you can reach out to Umart44 admin.";
        // The content of the SMS message.
        var message = result,
            applicationId = appId,
            messageType = type,
            senderId = senderId,
            destinationNumber = phone;

        //Create a new Pinpoint object.
        var pinpoint = new AWS.Pinpoint();

        // Specify the parameters to pass to the API.
        var params = {
            ApplicationId: applicationId,
            MessageRequest: {
                Addresses: {
                    [destinationNumber]: {
                        ChannelType: ChannelType
                    }
                },
                MessageConfiguration: {
                    SMSMessage: {
                        Body: message,
                        MessageType: messageType,
                        SenderId: senderId,
                    }
                }
            }
        };

    //    console.log("status ::"+status);

        //Try to send the message.
        pinpoint.sendMessages(params, function (err, data) {
            // If something goes wrong, print an error message.
            if (err) {
                logger.error("Unable to send De-Activated SMS " + err);
            } else {
               // console.log("data ::"+data);
                logger.info("De-Activated SMS sent successfully!"+data);
            }
        });

    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}
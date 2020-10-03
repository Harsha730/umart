'use strict';

// Functions to Generate the QRCode and tokens for each vendor 
exports.vendorQR = function generateQRCode() {
  return Math.floor(Math.random() * parseInt('8' + '9'.repeat(12 - 1)) + parseInt('1' + '0'.repeat(12 - 1)));
}

exports.userID = function generateUserID() {
  return Math.floor(Math.random() * parseInt('8' + '9'.repeat(8 - 1)) + parseInt('1' + '0'.repeat(8 - 1)));
}

exports.vendorID = function generateId() {
  var randomstring = require("randomstring");
  // Returning the Vendor ID
  return randomstring.generate();
}
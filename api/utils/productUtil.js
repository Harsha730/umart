'use strict';

// Functions to Generate the product SKU 
exports.getSku = function generateId() {
  var randomstring = require("randomstring");
  // Returning the Vendor ID
  return randomstring.generate({
    length: 8,
    charset: 'alphanumeric'
  });
}
'use strict';

// This function is to generate the secret key for every OTP request
exports.generateSecret = function generateSecret() {
  return Math.floor(Math.random() * parseInt('8' + '9'.repeat(6 - 1)) + parseInt('1' + '0'.repeat(6 - 1)));
}

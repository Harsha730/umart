'use strict';

// These functions are working as models for vendor-profiles.json file
exports.Vendor = function Vendor(qrCode, company_name, name, email, categories, phone, company_address, country, state, city, languagesPreferred, submittedDate, updatedDate, site, token, isApproved, comments, secret_key, timestamp) {

  this.qrCode = qrCode;
  this.company_name = company_name;
  this.name = name;
  this.email = email;
  this.categories = categories;
  this.phone = phone;
  this.company_address = company_address;
  this.country = country;
  this.state = state;
  this.city = city;
  this.languagesPreferred = languagesPreferred;
  this.submittedDate = submittedDate;
  this.updatedDate = updatedDate;
  this.site = site;
  this.token = token;
  this.isApproved = isApproved;
  this.comments = comments;
  this.secret_key = secret_key;
  this.timestamp = timestamp;

}

exports.Vendors = function Vendors(vendors) {
  this.vendors = vendors;
}

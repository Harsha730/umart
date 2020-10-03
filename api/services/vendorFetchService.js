'use strict';

// importing the required modules
var logger = require('../config/winston_Logger');  // importing the logger module
const db = require("../models/sequelize"),
  op = db.Sequelize.Op;

logger = logger(module) //Passing the module to the logger


/* This service contains the logic, to fetch the specified vendor from 
 the DB by using either phone or email or qrCode of the vendor*/

exports.fetchVendor = function (searchParam,locale, response) {

  logger.info("Entered into the fetchVendor function");

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into fetchVendor function");
      var temp_db,state,country,city;
      if(locale=="te_IN"){
      temp_db=db.translated_vendor,
      state=db.translated_state,
      city=db.translated_city,
      country=db.translated_country
      }
      else{
      temp_db=db.vendor
      state=db.state,
      city=db.city,
      country=db.country
      }
      var id = searchParam;

      // This function fetches the single vendor with the provided email or phone or qrcode
       temp_db.findOne({

        // Vendor columns to be fetched from DB while performing SELECT Query!
      
    //  attributes: [['qr_code', 'qrCode'], 'company_name','name', 'email', ['category', 'categories'], 'phone', 'company_address',['zip_code','zip'], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments','token','secret_key','timestamp','short_name','description','story','country_id','state_id','city_id','state','country','city'],

        // Check for the vendor with the provided phone or email or qrCode
        where: {
          [op.or]: [{
            email: {
              [op.eq]: id
            }
          }, {
            phone: {
              [op.eq]: id
            }
          }, { 
            qr_code: {
              [op.eq]: id
            }
          }
          ]
        },

            include:[{
              model:state
            },{
              model:country
            },
            {
              model:city
            },
          {
            model:db.priceBook,
            include:[{
              model:db.gst_slabs
            }]
          }]
      }).then(vendor => {
        var v_data=JSON.stringify(vendor),
        new_data=JSON.parse(v_data);
        console.log(new_data);
        if (null == vendor) {
          logger.error("vendor not found in the DB with the info ::" + id);
          reject(response.status(404).send("Unable to fetch your profile as no profile matching with the provided data. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        }
        else {
          var data = JSON.stringify(vendor),
            vendor_data = JSON.parse(data);
          vendor_data.category = vendor_data.category.split(",");
          vendor_data.language = vendor_data.language.split(",");
          if (vendor_data.is_approved == 1)
            vendor_data.is_approved = true;
          else
            vendor_data.is_approved = false;
          if(null==vendor.short_name)
          vendor.short_name="";
          var country_name,state_name,city_name;
          if(locale=="te_IN"){
            country_name=vendor_data.translated_country.name,
            state_name=vendor_data.translated_state.name,
            city_name=vendor_data.translated_city.name;
          }
          else{
            country_name=vendor_data.country.name,
            state_name=vendor_data.state.name,
            city_name=vendor_data.city.name;
          }
          logger.info("Found vendor");
          vendor_data=Object.assign(
            {},
            {
                qrCode: vendor_data.qr_code,
                company_name: vendor_data.company_name,
                name: vendor_data.name,
                email: vendor_data.email,
                categories: vendor_data.category,
                phone: vendor_data.phone,
                company_address: vendor_data.company_address,
                zip: vendor_data.zip_code,
                languagesPreferred: vendor_data.language,
                submittedDate: vendor_data.submitted_date,
                updatedDate: vendor_data.updated_date,
                site: vendor_data.site,
                isApproved: vendor_data.is_approved,
              /*   comments: vendor_data.comments,
                token: vendor_data.token,
                secret_key: vendor_data.secret_key,
                timestamp: vendor_data.timestamp, */
                short_name: vendor_data.short_name,
               /*  description: vendor_data.description,
                story: vendor_data.story, */
                state: state_name,
                country: country_name,
                city: city_name,
                price_book_id:vendor.price_book
              }
          ) 
          resolve(vendor_data);
        }
      }).catch(error => {
        console.log(error);
        logger.error("Error occured while fetching the vendor ::" + id);
        reject(response.status(500).send("Internal Server Error! Unable to fetch your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
      })

      logger.info("End of fetchVendor function");
    }
    catch (err) {
      logger.error("Error occured while fetching the vendor info ::" + err);
      reject(response.status(500).send("Internal Server Error! Unable to fetch your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  })
}


/* This service contains the logic, to fetch all
the existing vendor profiles from the DB */
exports.fetchAllVendors = function (locale,response) {

  // Creating and returning the promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into fetchAllVendors function");
      if(locale=="te_IN"){
           // This function fetches all the existing vendor profiles from the DB
           db.translated_vendor.findAll({
            // Vendor columns needs to be fetched from DB while performing SELECT Query!
            attributes: [['qr_code', 'qrCode'], 'company_name','short_name' ,'name', 'email', ['category', 'categories'], 'phone', 'company_address', 'country', 'state', 'city',['zip_code','zipcode '], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments'],
          }).then(vendors => {
            if (null == vendors) {
              logger.error("unable to fetch vendor profiles as no data found in the DB");
              reject(response.status(404).send("Unable to fetch vendor profiles as no data found. Thank you for your business."));
            }
            else {
              var data = JSON.stringify(vendors),
                vendors = JSON.parse(data);
              vendors.forEach(vendor => {
                vendor.categories = vendor.categories.split(",");
                vendor.languagesPreferred = vendor.languagesPreferred.split(",");
                if (vendor.isApproved == 1)
                  vendor.isApproved = true;
                else
                  vendor.isApproved = false;
                if(null==vendor.short_name)
                vendor.short_name="";
              });
    
              var vndor=vendors;
              vndor.sort(sortByProperty(""));
              // Constructing the JSON Object
              vendors = Object.assign(
                {},
                {
                  vendors: vendors
                },
              ),
                logger.info("found vendors");
              resolve(vendors);
            }
          }).catch(error => {
            logger.error("Error occured while fetching vendors " + error);
            reject(response.status(500).send("Internal Server Error! Unable to fetch your profiles. Thank you for your business."));
          })
          logger.info("End of fetchVendors function");
      }
      else{
     // This function fetches all the existing vendor profiles from the DB
     db.vendor.findAll({
      // Vendor columns needs to be fetched from DB while performing SELECT Query!
      attributes: [['qr_code', 'qrCode'], 'company_name','short_name' ,'name', 'email', ['category', 'categories'], 'phone', 'company_address', 'country', 'state', 'city',['zip_code','zipcode '], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments'],
    }).then(vendors => {
      if (null == vendors) {
        logger.error("unable to fetch vendor profiles as no data found in the DB");
        reject(response.status(404).send("Unable to fetch vendor profiles as no data found. Thank you for your business."));
      }
      else {
        var data = JSON.stringify(vendors),
          vendors = JSON.parse(data);
        vendors.forEach(vendor => {
          vendor.categories = vendor.categories.split(",");
          vendor.languagesPreferred = vendor.languagesPreferred.split(",");
          if (vendor.isApproved == 1)
            vendor.isApproved = true;
          else
            vendor.isApproved = false;
          if(null==vendor.short_name)
          vendor.short_name="";
        });
        var vndor=vendors;
        vndor.sort(sortByProperty(""));
        // Constructing the JSON Object
        vendors = Object.assign(
          {},
          {
            vendors: vendors
          },
        ),
          logger.info("found vendors");
        resolve(vendors);
      }
    }).catch(error => {
      logger.error("Error occured while fetching vendors " + error);
      reject(response.status(500).send("Internal Server Error! Unable to fetch your profiles. Thank you for your business."));
    })
    logger.info("End of fetchVendors function");
      }
    }
    catch (err) {
      logger.error("Error occured while fetching the vendors data.");
      reject(response.status(500).send("Internal Server Error! Unable to submit your profiles. Thank you for your business."));
    }
  })
}  

function sortByProperty(property){  
   return function(a,b){  
      if(a[property] > b[property])  
         return 1;  
      else if(a[property] < b[property])  
         return -1;  
      return 0;  
   }  
}

exports.fetchAllVendorsByCase = function (response,param) {

  // Creating and returning the promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into fetchAllVendors function");

      var condition=param+"%";
      condition=condition.toString();

      console.log(condition);

      // This function fetches all the existing vendor profiles from the DB
      db.vendor.findAll({
        // Vendor columns needs to be fetched from DB while performing SELECT Query!
        attributes: [['qr_code', 'qrCode'], 'company_name','short_name' ,'name', 'email', ['category', 'categories'], 'phone', 'company_address', 'country', 'state', 'city',['zip_code','zip'], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments'],
        where: {
          company_name: {
              [op.like]: condition
            }
          }
      }).then(vendors => {
        if (null == vendors) {
          logger.error("unable to fetch vendor profiles as no data found in the DB");
          reject(response.status(404).send("Unable to fetch vendor profiles as no data found. Thank you for your business."));
        }
        else {
          var data = JSON.stringify(vendors),
            vendors = JSON.parse(data);
          vendors.forEach(vendor => {
            vendor.categories = vendor.categories.split(",");
            vendor.languagesPreferred = vendor.languagesPreferred.split(",");
            if (vendor.isApproved == 1)
              vendor.isApproved = true;
            else
              vendor.isApproved = false;
            if(null==vendor.short_name)
            vendor.short_name="";
          });

          // Constructing the JSON Object
          vendors = Object.assign(
            {},
            {
              vendors: vendors
            },
          ),
            logger.info("found vendors");
          resolve(vendors);
        }
      }).catch(error => {
        logger.error("Error occured while fetching vendors " + error);
        reject(response.status(500).send("Internal Server Error! Unable to fetch your profiles. Thank you for your business."));
      })
      logger.info("End of fetchVendors function");
    }
    catch (err) {
      logger.error("Error occured while fetching the vendors data.");
      reject(response.status(500).send("Internal Server Error! Unable to submit your profiles. Thank you for your business."));
    }
  })
}  


exports.fetchAllVendorsByCategory = function (response,param) {

  // Creating and returning the promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into fetchAllVendors function");

      var condition="%"+param+"%";
      condition=condition.toString();

      console.log("in Categpry"+condition);

      // This function fetches all the existing vendor profiles from the DB
      db.vendor.findAll({
        // Vendor columns needs to be fetched from DB while performing SELECT Query!
        attributes: [['qr_code', 'qrCode'], 'company_name','short_name' ,'name', 'email', ['category', 'categories'], 'phone', 'company_address', 'country', 'state', 'city',['zip_code','zip'], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments'],
        where: {
          category: {
              [op.like]: condition
            }
          }
      }).then(vendors => {
        if (null == vendors) {
          logger.error("unable to fetch vendor profiles as no data found in the DB");
          reject(response.status(404).send("Unable to fetch vendor profiles as no data found. Thank you for your business."));
        }
        else {
          var data = JSON.stringify(vendors),
            vendors = JSON.parse(data);
          vendors.forEach(vendor => {
            vendor.categories = vendor.categories.split(",");
            vendor.languagesPreferred = vendor.languagesPreferred.split(",");
            if (vendor.isApproved == 1)
              vendor.isApproved = true;
            else
              vendor.isApproved = false;
            if(null==vendor.short_name)
            vendor.short_name="";
          });

          // Constructing the JSON Object
          vendors = Object.assign(
            {},
            {
              vendors: vendors
            },
          ),
            logger.info("found vendors");
          resolve(vendors);
        }
      }).catch(error => {
        logger.error("Error occured while fetching vendors " + error);
        reject(response.status(500).send("Internal Server Error! Unable to fetch your profiles. Thank you for your business."));
      })
      logger.info("End of fetchVendors function");
    }
    catch (err) {
      logger.error("Error occured while fetching the vendors data.");
      reject(response.status(500).send("Internal Server Error! Unable to submit your profiles. Thank you for your business."));
    }
  })
}  

exports.get_geo_list= function (locale,response) {

  logger.info("Entered into the get_geo_list function");

  // Creating and returning the Promise

  return new Promise(function (resolve, reject) {

    try {

      logger.info("Entered into get_geo_list function");

      if(locale=="te_IN"){
        db.translated_country.findAll({
          attributes: ['id','name','code'],
          include: [
            {
              model: db.translated_state, as: "states",
              attributes: [['state_id','id'],'name','country_id'],
                // Including all the required modules for the response
              include: [{
                attributes: [['city_id','id'],'name','state_id'],
                model: db.translated_city,as: "cities",
              },],
            },
          ]
        }).then(geoList => {
          if (null == geoList) {
            logger.error("geoList not found in the DB with the info ::");
            var data=Object.assign(
              {},
              {
                countries:{}
              },
            )
            resolve(data);
          }
          else {
            var data=Object.assign(
              {},
              {
                countries:geoList
              },
            )
            resolve(data);
          }
        }).catch(error => {
          console.log(error);
          logger.error("Error occured while fetching the vendor ::");
          reject(response.status(500).send("Internal Server Error! Unable to fetch geo-list. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
        })
    }
    else{
  // This function fetches the single vendor with the provided email or phone or qrcode
     // This function fetches the single vendor with the provided email or phone or qrcode
     db.country.findAll({
      // Vendor columns to be fetched from DB while performing SELECT Query!
     // attributes: [['qr_code', 'qrCode'], 'company_name','short_name' ,'name', 'email', ['category', 'categories'], 'phone', 'company_address', 'country', 'state', 'city',['zip_code','zip'], ['language', 'languagesPreferred'], ['submitted_date', 'submittedDate'], ['updated_date', 'updatedDate'], 'site', ['is_approved', 'isApproved'], 'comments'],

      // Check for the vendor with the provided phone or email or qrCode
      include: [
        {
          model: db.state,  // Including all the required modules for the response
          include: [{
            attributes: ['id','name','state_id'],
            model: db.city,
          },],
        },
      ]
    }).then(geoList => {
      if (null == geoList) {
        logger.error("geoList not found in the DB with the info ::");
        var data=Object.assign(
          {},
          {
            countries:{}
          },
        )
        resolve(data);
       // reject(response.status(404).send("Unable to fetch geoList"));
      }
      else {
        var data=Object.assign(
          {},
          {
            countries:geoList
          },
        )
        resolve(data);
      }
    }).catch(error => {
      console.log(error);
      logger.error("Error occured while fetching the vendor ::");
      var data=Object.assign(
        {},
        {
          countries:{}
        },
      )
      resolve(data);
    //  reject(response.status(500).send("Internal Server Error! Unable to fetch your profile. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    })
    }
      logger.info("End of fetchVendor function");
    }
    catch (err) {
      logger.error("Error occured while fetching the vendor info ::" + err);
      var data=Object.assign(
        {},
        {
          countries:{}
        },
      )
      resolve(data);
    //  reject(response.status(500).send("Internal Server Error! Unable to fetch geo-list. One of our agents will reach you soon. For quick response, please reach our support team at Contact Us. Thank you for your business."));
    }
  })
}


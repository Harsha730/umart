'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { cities } = require("../controllers/vendorController");
const { translated_vendor } = require("../models/sequelize");

logger = logger(module) // Passing the module to the logger

exports.getOutlet = function (id,sku,locale,res) {
  try {
    return new Promise(function (resolve, reject) {
      var temp_product,temp_vendor,temp_country,temp_state,temp_city,temp_country,temp_currency,temp_product_family,temp_alerts,temp_calender;
      if(locale=="te_IN"){
         temp_product=db.translated_product,
         temp_vendor=db.translated_vendor,
         temp_country=db.translated_country,
         temp_state=db.translated_state,
         temp_city=db.translated_city,
         temp_currency=db.translated_currency,
         temp_product_family=db.translated_product_family,
         temp_alerts=db.translated_outlet_alerts,
         temp_calender=db.translated_vendor_calender
      }
      else{
         temp_product=db.products,
         temp_vendor=db.vendor,
         temp_country=db.country,
         temp_state=db.state,
         temp_city=db.city,
         temp_currency=db.currency,
         temp_product_family=db.productFamily,
         temp_alerts=db.alerts,
         temp_calender=db.vendorCalender
      }
      var isSkuProvided=false,condition1,condition2;
      if(Boolean(sku))
      isSkuProvided=true;
      if(isSkuProvided) {
      condition2={sku : sku};
      condition1={qr_code : id};
      }
      else{
        console.log("in short_name");
      condition1={short_name:[id]}
      condition2=undefined;
      }

      logger.info("Entered into the getOutlet");
   //   console.log(translated_vendor+" "+temp_product);
   
   if(locale=="te_IN"){
    temp_vendor.findOne({
      where:condition1
    }).then(tempVendor=>{
     // console.log("temp_vendor"+tempVendor)
      if(null==tempVendor){
        temp_product=db.products,
         temp_vendor=db.vendor,
         temp_country=db.country,
         temp_state=db.state,
         temp_city=db.city,
         temp_currency=db.currency,
         temp_product_family=db.productFamily,
         temp_alerts=db.alerts,
         temp_calender=db.vendorCalender;
         temp_vendor.findAll({
          where:condition1,
          include: [
            {
              model: temp_product,  // Including all the required modules for the response
           //   all: true,
             where : condition2,
              include: [{
                model: temp_currency,
              },
              {
                model: temp_product_family
              }],
            },
             {
             model:db.priceBook
            },
            {
              model : temp_calender,
            },
            {
              model : temp_alerts,
            }, {
              model : temp_country
            },
            {
              model : temp_state
            },
            {
              model : temp_city
            },
          ]
        }
        ).then(vendors => {
        //  console.log(vendors);
          const resObj = vendors.map(vendor => {
          //  console.log(JSON.parse(JSON.stringify(vendor.price_book)));
            var opened="Hours of Operation: ";
            var opened_weeks=[],closed_weeks=[],speacial_weeks=[];
            var isfully_opened=true,open_hours="";
            var country="",state="",city="";
            var gst_number="",gst_percent="";
            if(null!=vendor.price_book)
            gst_number=vendor.price_book.gst_number,gst_percent=vendor.price_book.gst_percent;
            if(vendor.country==null)
            country="",state="",city="";
            else
            country=vendor.country.name,state=vendor.state.name,city=vendor.city.name;
            if(vendor.logo==null)
            vendor.logo="";
            if(vendor.show_logo==null)
            vendor.show_logo=false;
            return Object.assign(
              {},
              {
                // Getting the info required for the response
                products: vendor.products.map(product => {
                  var temp_tags=[];
                  if(null!=product.tags)
                  temp_tags=product.tags.split(",");
                  if(product.is_include_shipping==null)
                  product.is_include_shipping=true;
                  return Object.assign(
                    {},
                    {
                      sku: product.sku,
                      vendor_id: product.VENDOR_ID,
                      name: product.name,
                      short_description: product.short_description,
                      long_description: product.long_description,
                      price: product.price,
                      is_include_shipping : product.is_include_shipping,
                      quantity: product.quantity,
                      currency: product.currency,
                      is_active: product.is_active,
                      is_deleted : product.is_deleted,
                 //     reviews: product.reviews,
                      images: Object.assign(
                        {},
                        {
                          small: product.small_image_path,
                          standard: product.standard_image_path,
                          image_caption: product.image_caption
                        },
                      ),
                      tags:temp_tags,
                      outlet: Object.assign(
                        {},
                        {
                          qrCode: vendor.qr_code,
                          name: vendor.company_name
                        },
                      ),
                      filters: Object.assign(
                        {},
                        {
                          product_family: product.product_family.name,
                          outlet_location: vendor.city,
                          outlet_state: vendor.state,
                          outlet_pincode: vendor.zip_code
                        },
                      )
                    }
                  )
                }),
                 alerts: vendor.outlet_alerts.map(alert => {
                  return Object.assign(
                    {},
                    {
                      priorty:alert.priority,
                      message : alert.message
                    },
                  )
                }),
                calender: vendor.vendor_calenders.map(vendor_calender => {
                  if(false==vendor_calender.is_closed&&vendor_calender.hours.includes("-")){
                    if(open_hours==""||open_hours==vendor_calender.hours){
                      open_hours=vendor_calender.hours;
                      opened_weeks.push(vendor_calender.day);
                    }
                    else{
                      isfully_opened=false
                    }
                  }
                  if(true==vendor_calender.is_closed){
                    closed_weeks.push("Closed on "+vendor_calender.day+"s");
                  }
                  else if(!isfully_opened){
                    speacial_weeks.push("Operates on "+vendor_calender.day+"s between "+vendor_calender.hours.replace("-","to"));
                  } 
                  return Object.assign(
                    {},
                    {
                      day:vendor_calender.day,
                      parent_day:vendor_calender.parent_day,
                      hours : vendor_calender.hours,
                      isClosed : vendor_calender.is_closed
                    },
                  )
                }),
                calender_summary:Object.assign(
                  {},
                  {
                    regular_hours: opened+opened_weeks[0]+" to "+opened_weeks.pop()+" "+open_hours.replace("-","to"),
                    speacial_hours: speacial_weeks,
                    closed:closed_weeks,
                  }),
                  price_book:Object.assign(
                    {},
                    {
                      GST_Num:gst_number,
                      GST_Percent:gst_percent
                    }), 
                vendor: Object.assign(
                  {},
                  {
                    qrCode: vendor.qr_code,
                    company_name: vendor.company_name,
                    short_name : vendor.short_name,
                    name: vendor.name,
                    email: vendor.email,
                    categories: vendor.category.split(","),
                    phone: vendor.phone,
                    company_address: vendor.company_address,
                    country: vendor.country.name,
                    state: vendor.state.name,
                    city: vendor.city.name,
                    zipcode : vendor.zip_code,
                    languagesPreferred: vendor.language.split(","),
                    submittedDate: vendor.submitted_date,
                    updatedDate: vendor.updated_date,
                    site: vendor.site,
                    isApproved: vendor.is_approved,
               //     description:vendor.description,
               //     story:vendor.story,
                    logo:vendor.logo,
                    show_logo:vendor.show_logo
                  },
                )
              })
          });
          if (resObj.length == 0) {
            logger.error("Vendor not found in the DB with the info #" + id);
            if(isSkuProvided)
            reject(res.status(404).json("Unable to fetch product(s) as no product(s)/vendor found with the provided info. Thank you for your business."));
            else
            reject(res.status(404).json("Unable to fetch product(s) as no product(s) found under the provided name. Thank you for your business."));
          }
          else {
            logger.info("Found the vendor products ::" + id);
           if(resObj[0].calender_summary.regular_hours.includes("undefined"))
            resObj[0].calender_summary.regular_hours="";
            resolve((resObj[0]));
          }
        }, (error => {
        //  console.log(error);
          logger.error("Error occured ::" + error);
          reject(res.status(500).send("Internal Server Error! Unable to fetch products. Thank you for your business."));
        }))
      }
      else{
        temp_vendor.findAll({
          where:condition1,
          include: [
            {
              model: temp_product,  // Including all the required modules for the response
           //   all: true,
             where : condition2,
              include: [{
                model: temp_currency,
              },
              {
                model: temp_product_family
              }],
            },
           {
             model:db.translated_price_book
            },
            {
              model : temp_calender,
            },
            {
              model : temp_alerts,
            }, {
              model : temp_country
            },
            {
              model : temp_state
            },
            {
              model : temp_city
            },
          ]
        }
        ).then(vendors => {
     //     console.log(vendors);
          const resObj = vendors.map(vendor => {
          //  console.log(JSON.parse(JSON.stringify(vendor.price_book)));
            var opened="పని వేళలు: ";
            var opened_weeks=[],closed_weeks=[],speacial_weeks=[];
            var isfully_opened=true,open_hours="";
            var country="",state="",city="";
            var gst_number="",gst_percent="";
            if(null!=vendor.translated_price_book)
            gst_number=vendor.translated_price_book.gst_number,gst_percent=vendor.translated_price_book.gst_percent;
            if(vendor.country==null)
            country="",state="",city="";
            else
            country=vendor.country.name,state=vendor.state.name,city=vendor.city.name;
            if(vendor.logo==null)
            vendor.logo="";
            if(vendor.show_logo==null)
            vendor.show_logo=false;
            var country_name,state_name,city_name;
            if(locale=="te_IN"){
              country_name=vendor.translated_country.name,
              state_name=vendor.translated_state.name,
              city_name=vendor.translated_city.name;
            }
            else{
              country_name=vendor.country.name,
              state_name=vendor.state.name,
              city_name=vendor.city.name;
            }
            return Object.assign(
              {},
              {
                locale:'te_IN',
                // Getting the info required for the response
                products: vendor.translated_products.map(product => {
                  var temp_tags=[];
                  if(null!=product.tags)
                  temp_tags=product.tags.split(",");
                  if(product.is_include_shipping==null)
                  product.is_include_shipping=true;
                  return Object.assign(
                    {},
                    {
                      sku: product.sku,
                      vendor_id: product.VENDOR_ID,
                      name: product.name,
                      short_description: product.short_description,
                      long_description: product.long_description,
                      price: product.price,
                      is_include_shipping : product.is_include_shipping,
                      quantity: product.quantity,
                      currency: product.translated_currency,
                      is_active: product.is_active,
                      is_deleted : product.is_deleted,
                 //     reviews: product.reviews,
                      images: Object.assign(
                        {},
                        {
                          small: product.small_image_path,
                          standard: product.standard_image_path,
                          image_caption: product.image_caption
                        },
                      ),
                      tags:temp_tags,
                      outlet: Object.assign(
                        {},
                        {
                          qrCode: vendor.qr_code,
                          name: vendor.company_name
                        },
                      ),
                      filters: Object.assign(
                        {},
                        {
                          product_family: product.translated_product_family.name,
                          outlet_location: vendor.city,
                          outlet_state: vendor.state,
                          outlet_pincode: vendor.zip_code
                        },
                      )
                    }
                  )
                }),
          alerts: vendor.translated_outlet_alerts.map(alert => {
                  return Object.assign(
                    {},
                    {
                      priorty:alert.priority,
                      message : alert.message
                    },
                  )
                }),
                calender: vendor.translated_vendor_calenders.map(vendor_calender => {
                  if(false==vendor_calender.is_closed&&vendor_calender.hours.includes("-")){
                    if(open_hours==""||open_hours==vendor_calender.hours){
                      open_hours=vendor_calender.hours;
                      opened_weeks.push(vendor_calender.day);
                    }
                    else{
                      isfully_opened=false
                    }
                  }
                  if(true==vendor_calender.is_closed){
                    closed_weeks.push("Closed on "+vendor_calender.day+"s");
                  }
                  else if(!isfully_opened){
                    speacial_weeks.push("Operates on "+vendor_calender.day+"s between "+vendor_calender.hours.replace("-","to"));
                  } 
                  return Object.assign(
                    {},
                    {
                      day:vendor_calender.day,
                      parent_day:vendor_calender.parent_day,
                      hours : vendor_calender.hours,
                      isClosed : vendor_calender.is_closed
                    },
                  )
                }),
                calender_summary:Object.assign(
                  {},
                  {
                    regular_hours: opened+opened_weeks[0]+" నుండి "+opened_weeks.pop()+" వరకు "+open_hours.replace("-","నుండి")+" వరకు",
                    speacial_hours: speacial_weeks,
                    closed:closed_weeks,
                  }),
                  price_book:Object.assign(
                    {},
                    {
                      GST_Num:gst_number,
                      GST_Percent:gst_percent
                    }),
                vendor: Object.assign(
                  {},
                  {
                    qrCode: vendor.qr_code,
                    company_name: vendor.company_name,
                    short_name : vendor.short_name,
                    name: vendor.name,
                    email: vendor.email,
                    categories: vendor.category.split(","),
                    phone: vendor.phone,
                    company_address: vendor.company_address,
                    country: country_name,
                    state: state_name,
                    city: city_name,
                    zipcode : vendor.zip_code,
                    languagesPreferred: vendor.language.split(","),
                    submittedDate: vendor.submitted_date,
                    updatedDate: vendor.updated_date,
                    site: vendor.site,
                    isApproved: vendor.is_approved,
               //     description:vendor.description,
               //     story:vendor.story,
                    logo:vendor.logo,
                    show_logo:vendor.show_logo
                  },
                )
              })
          });
          if (resObj.length == 0) {
            logger.error("Vendor not found in the DB with the info #" + id);
            if(isSkuProvided)
            reject(res.status(404).json("Unable to fetch product(s) as no product(s)/vendor found with the provided info. Thank you for your business."));
            else
            reject(res.status(404).json("Unable to fetch product(s) as no product(s) found under the provided name. Thank you for your business."));
          }
          else {
            logger.info("Found the vendor products ::" + id);
           /*  if(resObj[0].calender_summary.regular_hours.includes("undefined"))
            resObj[0].calender_summary.regular_hours=""; */
            resolve((resObj[0]));
          }
        }, (error => {
     //     console.log(error);
          logger.error("Error occured ::" + error);
          reject(res.status(500).send("Internal Server Error! Unable to fetch outlet. Thank you for your business."));
        }))
      }
    })
   }
    else{
      console.log(condition1);
     // console.log("Requesting English")
      temp_vendor.findAll({
        where:condition1,
        include: [
          {
            model: temp_product,  // Including all the required modules for the response
         //   all: true,
           where : condition2,
            include: [{
              model: temp_currency,
            },
            {
              model: temp_product_family
            }, {
              model:db.priceBook,
              include:[{
                model:db.gst_slabs
              }]
             },],
          },
           {
           model:db.priceBook,
           include:[{
             model:db.gst_slabs
           }]
          },
          {
            model : temp_calender,
          },
          {
            model : temp_alerts,
          }, {
            model : temp_country
          },
          {
            model : temp_state
          },
          {
            model : temp_city
          },
          {
            model:db.vendorAlias,
            required: false,
            where:{is_outlet_display:true}
          }
        ]
      }
      ).then(vendors => {
      //  console.log(vendors);
        const resObj = vendors.map(vendor => {
        //  console.log(JSON.parse(JSON.stringify(vendor.price_book)));
          var opened="Hours of Operation: ";
          var opened_weeks=[],closed_weeks=[],speacial_weeks=[];
          var isfully_opened=true,open_hours="";
          var country="",state="",city="";
          var gst_number="",gst_percent="";
          if(null!=vendor.price_book)
          gst_number=vendor.price_book.gst_number,gst_percent=vendor.price_book.gst_percent;
          if(vendor.country==null)
          country="",state="",city="";
          else
          country=vendor.country.name,state=vendor.state.name,city=vendor.city.name;
          if(vendor.logo==null)
          vendor.logo="";
          if(vendor.show_logo==null)
          vendor.show_logo=false;
          return Object.assign(
            {},
            {
              // Getting the info required for the response
              products: vendor.products.map(product => {
                var temp_tags=[];
                if(null!=product.tags)
                temp_tags=product.tags.split(",");
                if(product.is_include_shipping==null)
                product.is_include_shipping=true;
                return Object.assign(
                  {},
                  {
                    sku: product.sku,
                    vendor_id: product.VENDOR_ID,
                    name: product.name,
                    short_description: product.short_description,
                    long_description: product.long_description,
                    price: product.price,
                    discount_price:product.discount_price,
                    is_include_shipping : product.is_include_shipping,
                    quantity: product.quantity,
                    currency: product.currency,
                    is_active: product.is_active,
                    is_deleted : product.is_deleted,
               //     reviews: product.reviews,
                    images: Object.assign(
                      {},
                      {
                        small: product.small_image_path,
                        standard: product.standard_image_path,
                        image_caption: product.image_caption
                      },
                    ),
                    tags:temp_tags,
                    price_book:product.price_book,
                    outlet: Object.assign(
                      {},
                      {
                        qrCode: vendor.qr_code,
                        name: vendor.company_name
                      },
                    ),
                    filters: Object.assign(
                      {},
                      {
                        product_family: product.product_family.name,
                        outlet_location: vendor.city,
                        outlet_state: vendor.state,
                        outlet_pincode: vendor.zip_code
                      },
                    )
                  }
                )
              }),
               alerts: vendor.outlet_alerts.map(alert => {
                return Object.assign(
                  {},
                  {
                    priorty:alert.priority,
                    message : alert.message
                  },
                )
              }),
              calender: vendor.vendor_calenders.map(vendor_calender => {
                if(false==vendor_calender.is_closed&&vendor_calender.hours.includes("-")){
                  if(open_hours==""||open_hours==vendor_calender.hours){
                    open_hours=vendor_calender.hours;
                    opened_weeks.push(vendor_calender.day);
                  }
                  else{
                    isfully_opened=false
                  }
                }
                if(true==vendor_calender.is_closed){
                  closed_weeks.push("Closed on "+vendor_calender.day+"s");
                }
                else if(!isfully_opened){
                  speacial_weeks.push("Operates on "+vendor_calender.day+"s between "+vendor_calender.hours.replace("-","to"));
                } 
                return Object.assign(
                  {},
                  {
                    day:vendor_calender.day,
                    parent_day:vendor_calender.parent_day,
                    hours : vendor_calender.hours,
                    isClosed : vendor_calender.is_closed
                  },
                )
              }),
              calender_summary:Object.assign(
                {},
                {
                  regular_hours: opened+opened_weeks[0]+" to "+opened_weeks.pop()+" "+open_hours.replace("-","to"),
                  speacial_hours: speacial_weeks,
                  closed:closed_weeks,
                }),
                /* price_book:Object.assign(
                  {},
                  {
                    GST_Num:gst_number,
                    GST_Percent:gst_percent
                  }),  */
              vendor: Object.assign(
                {},
                {
                  qrCode: vendor.qr_code,
                  company_name: vendor.company_name,
                  short_name : vendor.short_name,
                  name: vendor.name,
                  email: vendor.email,
                  categories: vendor.category.split(","),
                  phone: vendor.phone,
                  company_address: vendor.company_address,
                  country: vendor.country.name,
                  state: vendor.state.name,
                  city: vendor.city.name,
                  zipcode : vendor.zip_code,
                  languagesPreferred: vendor.language.split(","),
                  submittedDate: vendor.submitted_date,
                  updatedDate: vendor.updated_date,
                  site: vendor.site,
                  isApproved: vendor.is_approved,
             //     description:vendor.description,
             //     story:vendor.story,
                  logo:vendor.logo,
                  show_logo:vendor.show_logo,
                  price_book:vendor.price_book
                },
              ),
               alias: vendor.vendor_aliases.map(alias => {
                var temp_phone="+"+alias.phone,
                temp_email=alias.email;
                if("Yes"==alias.privacy_mode){
                  temp_phone="";
                  temp_email="";
                }
                return Object.assign(
                  {},
                  {
                     name : alias.name,
                     email: temp_email,
                     phone: temp_phone
                  })
                })
            })
        });
        if (resObj.length == 0) {
          logger.error("Vendor not found in the DB with the info #" + id);
          if(isSkuProvided)
          reject(res.status(404).json("Unable to fetch product(s) as no product(s)/vendor found with the provided info. Thank you for your business."));
          else
          reject(res.status(404).json("Unable to fetch product(s) as no product(s) found under the provided name. Thank you for your business."));
        }
        else {
          logger.info("Found the vendor products ::" + id);
         if(resObj[0].calender_summary.regular_hours.includes("undefined"))
          resObj[0].calender_summary.regular_hours="";
          resolve((resObj[0]));
        }
      }, (error => {
      //  console.log(error);
        logger.error("Error occured ::" + error);
        reject(res.status(500).send("Internal Server Error! Unable to fetch products. Thank you for your business."));
      }))
    }
    })
  }// end of try
  catch (error) {
    logger.error("Error occured ::" + error);
    reject(res.status(500).send("Internal Server Error! Unable to fetch your products. Thank you for your business."));
  }
}
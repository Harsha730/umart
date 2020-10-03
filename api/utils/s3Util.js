'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'),
    path = require('app-root-path');

logger = logger(module); // Passing the module to the logger

exports.getProductsFromS3 = function (bucket_name, file_name) {
    try {
        // Creating and returning the products
        return new Promise(function (resolve, reject) {

            const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
                props = PropertiesReader('./api/config/app.properties'); // getting the instance

            var /* AWS = require('aws-sdk'), */
                fs = require("fs"),
                /*     filePath = `${path}/api/config/config.json`;
                 AWS.config.loadFromPath(filePath);
              var  s3 = new AWS.CognitoIdentity();
                s3.config.region = 'us-east-1';
                     console.log(s3); */
                /*          var s3 = new AWS.S3(),
                            //construct getParam
                            getParams = {
                                Bucket: bucket_name, //replace example bucket with your s3 bucket name
                                Key: file_name // replace file location with your s3 file location
                            }
                            s3.putObject
                        let stream = s3.getObject(getParams).createReadStream(); */
                stream = fs.createReadStream("C:/Users/utadmin/Downloads/Brass_items.xlsx");
            var ExcelReader = require('node-excel-stream').ExcelReader;

            let reader = new ExcelReader(stream, {
                sheets: [{
                    name: 'Sheet1',
                    rows: {
                        headerRow: 1,
                        allowedHeaders: [
                            {
                                name: 'sku',
                                key: 'sku'
                            },
                            {
                                name: 'name',
                                key: 'name',
                            },
                            {
                                name: 'short_description',
                                key: 'short_description',
                            },
                            {
                                name: 'long_description',
                                key: 'long_description',
                            }, {
                                name: 'price',
                                key: 'price',
                            },
                            {
                                name: 'currency_id',
                                key: 'currency_id',
                            }, {
                                name: 'vendor_id',
                                key: 'vendor_id'
                            },
                            {
                                name: 'quantity',
                                key: 'quantity',
                            }, {
                                name: 'product_family_id',
                                key: 'product_family_id',
                            },
                            {
                                name: 'small_image_path',
                                key: 'small_image_path',
                            }, {
                                name: 'standard_image_path',
                                key: 'standard_image_path',
                            }, {
                                name: 'image_caption',
                                key: 'image_caption',
                            },


                            {
                                name: 'is_active',
                                key: 'is_active',
                            }, {
                                name: 'is_elevated',
                                key: 'is_elevated',
                            },
                            {
                                name: 'is_deleted',
                                key: 'is_deleted',
                            },
                            {
                                name: 'is_include_shipping',
                                key: 'is_include_shipping'
                            }, {
                                name: 'parent_product_id',
                                key: 'parent_product_id',
                            },
                            {
                                name: 'locale',
                                key: 'locale',
                            },

                        ]
                    }
                }]
            })

            var products = [], productSku = require('../utils/productUtil');
            reader.eachRow((rowData, rowNum, sheetSchema) => {
          /*  var product_sku=productSku.getSku();
                rowData.sku=product_sku.slice(0,8);
                console.log("Price ::"+rowData.price);
             //   rowData.price=rowData.price.toString().replace(/,/g, '');
                console.log("Price ::"+rowData.price);
                rowData.small_image_path= rowData.small_image_path.replace("'","");
                rowData.standard_image_path=rowData.standard_image_path.replace("'","");
                if(rowData.product_family_id=="Sarees")
                  rowData.product_family_id=19;
                else if(rowData.product_family_id=="Duppata")
                   rowData.product_family_id=20;
                else if(rowData.product_family_id=="Dress Material")
                   rowData.product_family_id=21
                if(rowData.currency_id=="INR")
                rowData.currency_id=1;
                if(rowData.name==undefined)
                rowData.name="Title not Available";
                if(rowData.is_include_shipping=='SHIPPING')
                 rowData.is_include_shipping=false;
                else
                 rowData.is_include_shipping=true;
                 
            logger.info("Product sku :"+rowData.sku);    
            logger.info("Product sku :"+rowData.product_family_id);   
 */            products.push(rowData);
            })
                .then(() => {
                    resolve(products);
                }).catch(error => {
                    reject("unable get products from S3" + error);
                })
        })// end of promise
    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}
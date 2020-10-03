'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'),
    path = require('app-root-path');

logger = logger(module); // Passing the module to the logger

exports.upload = function (file,res) {
    try {
        // Creating and returning the products
        return new Promise(function (resolve, reject) {

            const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
                props = PropertiesReader('./api/config/app.properties'); // getting the instance

            var AWS = require('aws-sdk'),
                fs = require("fs"),
                filePath = `${path}/api/config/config.json`;
            AWS.config.loadFromPath(filePath);
            // var bucket=bucket_name.toLowerCase().replace(/ /g,"_");
            var bucket = 'unititech',
                s3 = new AWS.S3();
            const params = {
                Bucket: bucket,
                Key: file.name,
                Body: Buffer.from(file.data, "binary"),
                ACL: 'public-read',
                ContentType: file.mimetype
            };
            s3.upload(params, function (err, data) {
                if (err) {
                    console.log('There was an error uploading your file: ', err);
                    reject(res.status(500).send("There was an error uploading your file"));
                }
                console.log('Successfully uploaded file.', data);
                resolve(data.Location);
            });

            /* et reader = new ExcelReader(stream, {
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
                        name: 'qrCode',
                        key: 'vendor_id'
                    }, {
                        name: 'product_name',
                        key: 'name',
                    }, {
                        name: 'product_family',
                        key: 'product_family_id',
                    },
                    {
                        name: 'small image', 
                        key: 'small_image_path',
                    }, {
                        name: 'standard_image',
                        key: 'standard_image_path',
                    }, {
                        name: 'image_caption',
                        key: 'image_caption',
                    },
                    {
                        name: 'short_description',
                        key: 'short_description',
                    },
                    {
                        name: 'long_description',
                        key: 'long_description',
                    },
                    {
                        name: 'price',
                        key: 'price',
                    },
                    {
                        name: 'currency',
                        key: 'currency_id',
                    },
                    {
                        name: 'quantity',
                        key: 'quantity',
                    },
                    {
                        name: 'is_active',
                        key: 'is_active',
                    },
                ]
                }
            }]
        }) */

        })// end of promise
    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}
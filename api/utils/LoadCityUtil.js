'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'),
    path = require('app-root-path');

logger = logger(module); // Passing the module to the logger

exports.getCitiesFromExcel = function () {
    try {
        // Creating and returning the products
        return new Promise(function (resolve, reject) {

        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

        var fs = require("fs");
/*          var s3 = new AWS.S3(),
            //construct getParam
            getParams = {
                Bucket: bucket_name, //replace example bucket with your s3 bucket name
                Key: file_name // replace file location with your s3 file location
            }
            s3.putObject
        let stream = s3.getObject(getParams).createReadStream(); */ 
        let stream=fs.createReadStream("C:/Users/utadmin/Documents/Cities.xlsx");
        var ExcelReader = require('node-excel-stream').ExcelReader;
        let reader = new ExcelReader(stream, {
            sheets: [{
                name: 'Sheet1',
                rows: {
                    headerRow: 1,
                    allowedHeaders: [
                        {
                            name: 'states__cities__id',
                            key: 'city_id'
                        },
                        {
                        name: 'states__cities__name',
                        key: 'name'
                    }, {
                        name: 'states__cities__state_id',
                        key: 'state_id',
                    },{
                        name: 'parent_city_id',
                        key: 'parent_city_id',
                    },
                    {
                        name: 'locale', 
                        key: 'locale',
                    }
                ]
                }
            }]
        })

        var cities=[];
        reader.eachRow((rowData, rowNum, sheetSchema) => {
           /* var product_sku=productSku.getSku();
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
                 rowData.is_include_shipping=true; */
            cities.push(rowData);
        })
            .then(() => {
                resolve(cities);
            }).catch(error=>{
                reject("unable get cities from Excel"+error);
            })
        })// end of promise
    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}
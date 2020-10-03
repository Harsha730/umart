'use strict';

// importing the required modules
var logger = require('../config/winston_Logger'),
    path = require('app-root-path');

logger = logger(module); // Passing the module to the logger

exports.parseExcel = function (path) {
    try {
        const PropertiesReader = require('properties-reader'), // Importing the properties reader-module
            props = PropertiesReader('./api/config/app.properties'); // getting the instance

            var ExcelReader = require('node-excel-stream').ExcelReader;
            
let reader = new ExcelReader(dataStream, {
    sheets: [{
        name: 'Users',
        rows: {
            headerRow: 1,
            allowedHeaders: [{
                name: 'User Name',
                key: 'userName'
            }, {
                name: 'Value',
                key: 'value',
                type: Number
            }]
        }
    }]
})
console.log('starting parse');
reader.eachRow((rowData, rowNum, sheetSchema) => {
    console.log(rowData);
})
.then(() => {
    console.log('done parsing');
});
      
        
    
    }// end of try
    catch (error) {
        logger.error("Error occured ::" + error);
    }// end of catch
}
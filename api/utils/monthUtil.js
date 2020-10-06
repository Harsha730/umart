'use strict';

// Functions to Generate the QRCode and tokens for each vendor 
exports.getMonthName = function getMonthName(month_num) {
  var month=new Array(12);
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";
  return month[month_num];
}
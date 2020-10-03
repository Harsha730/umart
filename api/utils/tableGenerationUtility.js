'use strict';

exports.generateTable=function(tableBody){

    var jsdom = require("jsdom");
    var JSDOM = jsdom.JSDOM;
    var dom=new JSDOM(`<!DOCTYPE html><table></table>`);
    const document=dom.window.document;


let mountains = [
    { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
    { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
    { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
    { name: "Monte Amiata", height: 1738, place: "Siena" }
  ];
  
  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
   // console.log(data);
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  
  function generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
    //   console.log(element);
      Object.keys(element).forEach(function(key) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      })
    }
  }
  
  let table = document.querySelector("table");
  let data = Object.keys(mountains[0]);
  generateTableHead(table, data);
  generateTable(table, mountains);
  let message = (
    '<table>' +
    '<thead>' +
    '<th> S.No </th>' +
    '<th> Name </th>'  +
    '<th> Quantity </th>'  +
    '<th> Price </th>'  +
    /*...*/
    '</thead>'
  );

  for (let element of mountains) {
  //   console.log(element);
        message += (
            '<tr>' +
             '<td>' + element.name + '</td>' +
             '<td>' + element.height + '</td>' +
             '<td>' + element.place + '</td>' +
             /*...*/
           '</tr>'
          );
  }

  message +=  '</table>';

  var orderPaymentUpdateMail=require('../utils/customerPaymentUpdateMail');
            orderPaymentUpdateMail.paymentUpdateMail("Munishnaramala@gmail.com","","outlet_name","order_id","vendor_name","vendor_email","vendor_phone","Paid","data.payment_type.name",message);
}
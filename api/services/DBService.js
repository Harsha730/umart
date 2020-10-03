var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test',
  port     : 3306
});

exports.connect=connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');

 const query= 'SELECT Products.sku,Products.Name,Products.short_description,Products.price,Currency.code as Cuurency_Code,Reviews.rating, Reviews.comment, Products.small_image_path, Products.standard_image_path , Products.image_caption, Products.is_active,Vendor.QR_CODE,vendor.Name as Vendor_Name,Product_family.name as Product_Family from Catalog.Products as Products JOIN Catalog.Vendor  as Vendor on Products.vendor_id=Vendor.QR_CODE JOIN Catalog.Currency as Currency on Products.currency_id=Currency.id JOIN Catalog.Product_family as Product_family on Products.product_family_id=Product_family.id JOIN Catalog.Reviews as Reviews on Products.review_id=Reviews.id Where Vendor.QR_CODE='+983918150281;
  
 connection.query(query, (err,rows) => {
    if(err) throw err;
  
    console.log('Data received from Db:');
    console.log(rows);
    var data=JSON.stringify(rows);
    console.log();
    
  });

});


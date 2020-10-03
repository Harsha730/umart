const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./products.model.js")(sequelize, Sequelize);
db.vendor = require("./vendor.model.js")(sequelize, Sequelize);
db.country = require("./countries.model.js")(sequelize, Sequelize);
db.state = require("./states.model.js")(sequelize, Sequelize);
db.city = require("./cities.model.js")(sequelize, Sequelize);
db.zip = require("./zipcodes.model.js")(sequelize, Sequelize);
db.vendorCategory = require("./vendorCategory.model.js")(sequelize, Sequelize);
db.vendorLang = require("./vendorLanguage.model.js")(sequelize, Sequelize);
db.reviews = require("./reviews.model.js")(sequelize, Sequelize);
db.productFamily = require("./productFamilies.model.js")(sequelize, Sequelize);
db.currency = require("./currency.model.js")(sequelize, Sequelize);
db.vendorCalender=require("./vendorCalender.model.js")(sequelize,Sequelize);
db.alerts=require("./outletAlerts.model.js")(sequelize,Sequelize);
db.vendorAlerts=require("./vendorOutletAlerts.model.js")(sequelize,Sequelize);
db.vendorAlias=require("./vendorAlias.model.js")(sequelize,Sequelize);
db.message=require('./messages.model.js')(sequelize,Sequelize);
db.slotTimings=require('./slotTimings.model.js')(sequelize,Sequelize);
db.user=require('./user.model.js')(sequelize,Sequelize);
db.order=require('./orders.model.js')(sequelize,Sequelize);
db.orderItems=require('./orderItems.model.js')(sequelize,Sequelize);
db.customer=require('./customer.model.js')(sequelize,Sequelize);
db.paymentType=require('./paymentType.js')(sequelize,Sequelize);
db.paymentStatus=require('./paymentStatus.js')(sequelize,Sequelize);
db.shipmentType=require('./shipmentType.js')(sequelize,Sequelize);
db.orderStatus=require('./orderStatus.js')(sequelize,Sequelize);
db.priceBook=require('./priceBook.model.js')(sequelize,Sequelize);
db.translated_country=require('./translatedCountries.model.js')(sequelize,Sequelize);
db.translated_state=require('./translatedState.model.js')(sequelize,Sequelize);
db.translated_city=require('./translatedCities.model.js')(sequelize,Sequelize);
db.translated_currency=require('./translatedCurrency.model.js')(sequelize,Sequelize);
db.translated_product_family=require('./translatedProductFamilies.model.js')(sequelize,Sequelize);
db.translated_product=require('./translatedProduct.model.js')(sequelize,Sequelize);
db.translated_vendor=require('./translatedVendor.model.js')(sequelize,Sequelize);
db.translated_vendor_calender=require('./translatedVendorCalender.model.js')(sequelize,Sequelize);
db.translated_outlet_alerts=require('./translatedVendorAlerts.model.js')(sequelize,Sequelize);
db.translated_vendor_alerts=require('./translatedVendorOutletAlerts.model.js')(sequelize,Sequelize);
db.translated_slot_timings=require('./translatedSlotTimings.model.js')(sequelize,Sequelize);
db.translated_reviews=require('./translatedReviews.model.js')(sequelize,Sequelize);
db.translated_price_book=require('./translatedPriceBook.model')(sequelize,Sequelize);
db.gst_slabs=require('./gstSlabs.model')(sequelize,Sequelize);

// Configuring the table Associations
db.products.belongsTo(db.vendor, { foreignKey: 'vendor_id' });
db.vendor.hasMany(db.products, { foreignKey: 'vendor_id' });
db.products.belongsTo(db.currency, { foreignKey: 'currency_id', foreignKeyConstraint: true });
db.currency.hasMany(db.products, { foreignKey: 'currency_id' });
db.reviews.belongsTo(db.products, { foreignKey: 'product_id', foreignKeyConstraint: true });
db.products.hasMany(db.reviews, { foreignKey: 'product_id' });
db.products.belongsTo(db.productFamily, { foreignKey: 'product_family_id', foreignKeyConstraint: true });
db.productFamily.hasMany(db.products, { foreignKey: 'product_family_id' });
db.vendorCalender.belongsTo(db.vendor,{ foreignKey : 'vendor_id', foreignKeyConstraint: true });
db.vendor.hasMany(db.vendorCalender, {foreignKey : 'vendor_id'});
db.alerts.belongsToMany(db.vendor,{through: db.vendorAlerts, foreignKey: 'alert_id', otherKey: 'vendor_id'});
db.vendor.belongsToMany(db.alerts,{through: db.vendorAlerts, foreignKey: 'vendor_id', otherKey: 'alert_id'});
db.vendorAlias.belongsTo(db.vendor, { foreignKey: 'vendor_id',foreignKeyConstraint: true });
db.vendor.hasMany(db.vendorAlias, { foreignKey: 'vendor_id' }); 

db.state.belongsTo(db.country,{ foreignKey: 'country_id'})
db.country.hasMany(db.state,{ foreignKey: 'country_id'})
db.city.belongsTo(db.state,{ foreignKey: 'state_id'})
db.state.hasMany(db.city,{ foreignKey: 'state_id'})

db.translated_state.belongsTo(db.translated_country,{foreignKey: 'country_id'})
db.translated_country.hasMany(db.translated_state,{as: 'states', foreignKey: 'country_id'})
db.translated_city.belongsTo(db.translated_state,{ foreignKey: 'state_id'})
db.translated_state.hasMany(db.translated_city,{as: 'cities', foreignKey: 'state_id'})

db.vendor.belongsTo(db.state,{foreignKey: 'state_id'})
db.state.hasOne(db.vendor,{foreignKey: 'state_id'})
db.vendor.belongsTo(db.country,{foreignKey: 'country_id'})
db.country.hasOne(db.vendor,{foreignKey: 'country_id'})
db.vendor.belongsTo(db.city,{foreignKey: 'city_id'})
db.city.hasOne(db.vendor,{foreignKey: 'city_id'})

db.user.belongsTo(db.vendor,{foreignKey : 'vendor_id'})
db.vendor.hasMany(db.user,{foreignKey : 'vendor_id'})

db.user.belongsTo(db.slotTimings,{foreignKey : 'time_slot'})
db.slotTimings.hasMany(db.user,{foreignKey : 'time_slot'})

db.slotTimings.belongsTo(db.vendor,{foreignKey : 'vendor_id'})
db.vendor.hasMany(db.slotTimings,{foreignKey : 'vendor_id'})

db.productFamily.belongsTo(db.vendor, { foreignKey: 'vendor_id' });
db.vendor.hasMany(db.productFamily, { foreignKey: 'vendor_id' });

db.customer.belongsTo(db.country,{as:'billing_country', foreignKey: 'country_id'})
db.country.hasMany(db.customer,{as:'billing_country',foreignKey: 'country_id'})

db.customer.belongsTo(db.country,{as:'shipping_country',foreignKey: 'shipping_country_id'})
db.country.hasMany(db.customer,{as:'shipping_country',foreignKey: 'shipping_country_id'})

db.customer.belongsTo(db.state,{as:'billing_state',foreignKey: 'state_id'})
db.state.hasMany(db.customer,{as:'billing_state', foreignKey: 'state_id' })

db.customer.belongsTo(db.state,{as:'shipping_state',foreignKey: 'shipping_state_id' })
db.state.hasMany(db.customer,{as:'shipping_state',foreignKey: 'shipping_state_id' })

db.customer.belongsTo(db.city,{as:'billing_city',foreignKey: 'city_id' })
db.city.hasMany(db.customer,{as:'billing_city', foreignKey: 'city_id' })

db.customer.belongsTo(db.city,{as:'shipping_city',foreignKey: 'shipping_city_id' })
db.city.hasMany(db.customer,{as:'shipping_city',foreignKey: 'shipping_city_id' })

db.order.belongsTo(db.customer, { foreignKey: 'customer_id' });
db.customer.hasMany(db.order, { foreignKey: 'customer_id' });

db.order.belongsTo(db.vendor, { foreignKey: 'vendor_id' });
db.vendor.hasMany(db.order, { foreignKey: 'vendor_id' });

db.orderItems.belongsTo(db.order, { foreignKey: 'order_id' });
db.order.hasMany(db.orderItems, { foreignKey: 'order_id' });

db.orderItems.belongsTo(db.products, { foreignKey: 'product_id',targetKey:'sku'});
db.products.hasMany(db.orderItems, { foreignKey: 'product_id',targetKey:'sku'});

db.orderItems.belongsTo(db.customer, { foreignKey: 'customer_id' });
db.customer.hasMany(db.orderItems, { foreignKey: 'customer_id' });

db.orderItems.belongsTo(db.vendor, { foreignKey: 'vendor_id' });
db.vendor.hasMany(db.orderItems, { foreignKey: 'vendor_id' });

db.order.belongsTo(db.paymentType, { as :'paymentType',foreignKey: 'payment_type' });
db.paymentType.hasMany(db.order, { as : 'paymentType', foreignKey: 'payment_type' });

db.order.belongsTo(db.paymentStatus, { as :'paymentStatus',foreignKey: 'payment_status' });
db.paymentStatus.hasMany(db.order, { as :'paymentStatus',foreignKey: 'payment_status' });

db.order.belongsTo(db.shipmentType, { as :'shipmentType',foreignKey: 'shipment_type' });
db.shipmentType.hasMany(db.order, {as :'shipmentType', foreignKey: 'shipment_type' });

db.order.belongsTo(db.orderStatus, {as :'orderStatus', foreignKey: 'status' });
db.orderStatus.hasMany(db.order, {as :'orderStatus', foreignKey: 'status' });

// db.priceBook.belongsTo(db.vendor, {foreignKey: 'vendor_id' });
// db.vendor.hasOne(db.priceBook, {foreignKey: 'vendor_id' });

db.order.belongsTo(db.currency,{foreignKey: 'currency_id' });
db.currency.hasOne(db.order,{foreignKey: 'currency_id' });

db.translated_product.belongsTo(db.translated_vendor, { foreignKey: 'vendor_id' });
db.translated_vendor.hasMany(db.translated_product, { foreignKey: 'vendor_id' });
db.translated_product.belongsTo(db.translated_currency, { foreignKey: 'currency_id', foreignKeyConstraint: true });
db.translated_currency.hasMany(db.translated_product, { foreignKey: 'currency_id' });
db.translated_product.belongsTo(db.translated_product_family, { foreignKey: 'product_family_id', foreignKeyConstraint: true });
db.translated_product_family.hasMany(db.translated_product, { foreignKey: 'product_family_id' });

db.translated_product_family.belongsTo(db.translated_vendor, { foreignKey: 'vendor_id' });
db.translated_vendor.hasMany(db.translated_product_family, { foreignKey: 'vendor_id' });

db.translated_vendor.belongsTo(db.translated_state,{foreignKey: 'state_id'})
db.translated_state.hasOne(db.translated_vendor,{foreignKey: 'state_id'})
db.translated_vendor.belongsTo(db.translated_country,{foreignKey: 'country_id'})
db.translated_country.hasOne(db.translated_vendor,{foreignKey: 'country_id'})
db.translated_vendor.belongsTo(db.translated_city,{foreignKey: 'city_id'})
db.translated_city.hasOne(db.translated_vendor,{foreignKey: 'city_id'})

db.translated_vendor_calender.belongsTo(db.translated_vendor,{ foreignKey : 'vendor_id', foreignKeyConstraint: true });
db.translated_vendor.hasMany(db.translated_vendor_calender, {foreignKey : 'vendor_id'});
db.translated_outlet_alerts.belongsToMany(db.translated_vendor,{through: db.translated_vendor_alerts, foreignKey: 'alert_id', otherKey: 'vendor_id'});
db.translated_vendor.belongsToMany(db.translated_outlet_alerts,{through: db.translated_vendor_alerts, foreignKey: 'vendor_id', otherKey: 'alert_id'});

db.translated_slot_timings.belongsTo(db.translated_vendor,{foreignKey : 'vendor_id'})
db.translated_vendor.hasMany(db.translated_slot_timings,{foreignKey : 'vendor_id'})

db.translated_reviews.belongsTo(db.translated_product, { foreignKey: 'product_id', foreignKeyConstraint: true });
db.translated_product.hasMany(db.translated_reviews, { foreignKey: 'product_id' });

db.translated_price_book.belongsTo(db.translated_vendor, {foreignKey: 'vendor_id' });
db.translated_vendor.hasOne(db.translated_price_book, {foreignKey: 'vendor_id' });

db.translated_country.belongsTo(db.country, {foreignKey: 'parent_country_id' });
db.country.hasOne(db.translated_country, {foreignKey: 'parent_country_id' });

db.translated_slot_timings.belongsTo(db.slotTimings, {foreignKey: 'parent_id' });
db.slotTimings.hasOne(db.translated_slot_timings, {foreignKey: 'parent_id' });

db.vendor.belongsTo(db.priceBook, {foreignKey: 'price_book_id' });
db.priceBook.hasOne(db.vendor, {foreignKey: 'price_book_id' });

db.products.belongsTo(db.priceBook, {foreignKey: 'price_book_id'});
db.priceBook.hasOne(db.products, {foreignKey: 'price_book_id'});

db.priceBook.belongsTo(db.gst_slabs, {foreignKey: 'gst_slab_id'});
db.gst_slabs.hasOne(db.priceBook, {foreignKey: 'gst_slab_id'});

module.exports = db;
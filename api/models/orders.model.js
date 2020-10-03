module.exports = (sequelize, Sequelize) => {
  const orders = sequelize.define("orders", {
    id: {
      type: Sequelize.CHAR,
      primaryKey: true
    },
    checkout_type:{
      type: Sequelize.CHAR
    },
    customer_id: {
      type: Sequelize.INTEGER
    },
    vendor_id: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.DOUBLE
    },
     payment_type: {
      type: Sequelize.INTEGER
    },
    payment_status: {
      type: Sequelize.INTEGER
    },
    payment_notes: {
      type: Sequelize.STRING
    },
    shipment_type: {
      type: Sequelize.INTEGER
    },
    shipment_notes: {
      type: Sequelize.STRING
    },
    shipment_tracking: {
      type: Sequelize.STRING
    },
    items:{
      type: Sequelize.INTEGER
    },
    created_date:{
      type: Sequelize.STRING
    },
    updated_date:{
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.INTEGER,
    },
    currency_id:{
     type: Sequelize.INTEGER,
    },
    shipment_updated_date:{
     type: Sequelize.STRING
    },
    payment_updated_date:{
      type: Sequelize.STRING
     },
    status_notes:{
      type: Sequelize.STRING
     },
     gst_percent:{
       type: Sequelize.DOUBLE
     },
     tax_price:{
      type: Sequelize.DOUBLE
    },
     grand_total:{
      type: Sequelize.DOUBLE
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'orders'
  });
  return orders;
};
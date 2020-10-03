module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define("order_items", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER
    },
    product_id: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.INTEGER
    }, customer_id: {
      type: Sequelize.INTEGER
    },
    vendor_id: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'order_items'
  });
  return OrderItems;
};
module.exports = (sequelize, Sequelize) => {
  const customer = sequelize.define("customer", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    state_id: {
      type: Sequelize.INTEGER
    },
    city_id: {
      type: Sequelize.INTEGER,
    },
    zip: {
      type: Sequelize.CHAR
    },
    billing_address: {
      type: Sequelize.STRING,
    },
    shipping_name: {
      type: Sequelize.STRING
    },
    shipping_phone: {
      type: Sequelize.INTEGER
    },
    shipping_email: {
      type: Sequelize.STRING
    },
    shipping_country_id: {
      type: Sequelize.INTEGER
    },
    shipping_state_id: {
      type: Sequelize.INTEGER
    },
    shipping_city_id: {
      type: Sequelize.INTEGER,
    },
    shipping_zip: {
      type: Sequelize.CHAR
    },
    shipping_address: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'customer'
  });
  return customer;
};
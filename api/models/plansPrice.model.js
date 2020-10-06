module.exports = (sequelize, Sequelize) => {
  const plan_price = sequelize.define("plan_price", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    country: {
      type: Sequelize.CHAR
    },
    currency_code: {
      type: Sequelize.CHAR
    },
    price: {
      type: Sequelize.DOUBLE
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'plan_price'
  });
  return plan_price;
};
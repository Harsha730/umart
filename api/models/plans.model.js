module.exports = (sequelize, Sequelize) => {
  const plans = sequelize.define("plans", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
  /*   price_id: {
      type: Sequelize.INTEGER
    }, */
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
    tableName: 'plans'
  });
  return plans;
};
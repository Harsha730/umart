module.exports = (sequelize, Sequelize) => {
  const currency = sequelize.define("currency", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    code: {
      type: Sequelize.CHAR
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'currency'
  });

  return currency;
};
module.exports = (sequelize, Sequelize) => {
  const translated_currency = sequelize.define("translated_currency", {
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
    locale:{
      type:Sequelize.CHAR
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_currency'
  });

  return translated_currency;
};
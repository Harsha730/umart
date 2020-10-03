module.exports = (sequelize, Sequelize) => {
  const vendor_lnguage = sequelize.define("vendor_language", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    locale_code: {
      type: Sequelize.CHAR
    },
  }, {

    timestamps: false,
    freezeTableName: true,
    tableName: 'vendor_language'

  });

  return vendor_lnguage;
};
module.exports = (sequelize, Sequelize) => {
  const vendor_category = sequelize.define("vendor_category", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    display_name: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
  }, {

    timestamps: false,
    freezeTableName: true,
    tableName: 'vendor_category'

  });

  return vendor_category;
};
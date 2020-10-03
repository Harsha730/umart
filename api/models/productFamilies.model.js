module.exports = (sequelize, Sequelize) => {
  const product_family = sequelize.define("product_family", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    parent_id: {
      type: Sequelize.INTEGER
    },vendor_id: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'product_family'
  });
  return product_family;
};
module.exports = (sequelize, Sequelize) => {
  const orderStatus = sequelize.define("order_status", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'order_status'
  });
  return orderStatus;
};
module.exports = (sequelize, Sequelize) => {
  const paymentStatus = sequelize.define("payment_status", {
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
    tableName: 'payment_status'
  });
  return paymentStatus;
};
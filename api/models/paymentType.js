module.exports = (sequelize, Sequelize) => {
  const paymentType = sequelize.define("payment_type", {
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
    tableName: 'payment_type'
  });
  return paymentType;
};
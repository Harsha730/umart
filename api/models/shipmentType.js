module.exports = (sequelize, Sequelize) => {
  const shipment = sequelize.define("shipment", {
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
    tableName: 'shipment'
  });
  return shipment;
};
module.exports = (sequelize, Sequelize) => {
    const vendorAlerts = sequelize.define("vendor_outlet_alerts", {
        vendor_id: {
        type: Sequelize.INTEGER,
      },
      alert_id: {
        type: Sequelize.INTEGER
      },
    },{
      timestamps: false,
      freezeTableName: true,
      tableName: 'vendor_outlet_alerts'
    });
    return vendorAlerts;
  };

module.exports = (sequelize, Sequelize) => {
    const translated_vendor_outlet_alerts = sequelize.define("translated_vendor_outlet_alerts", {
        vendor_id: {
        type: Sequelize.INTEGER,
      },
      alert_id: {
        type: Sequelize.INTEGER
      },locale: {
        type: Sequelize.CHAR
      },
    },{
      timestamps: false,
      freezeTableName: true,
      tableName: 'translated_vendor_outlet_alerts'
    });
    return translated_vendor_outlet_alerts;
  };

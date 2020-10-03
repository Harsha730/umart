module.exports = (sequelize, Sequelize) => {
    const translated_outlet_alerts = sequelize.define("translated_outlet_alerts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      priority: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
    },{
      timestamps: false,
      freezeTableName: true,
      tableName:'translated_outlet_alerts'
    });
    return translated_outlet_alerts;
  };
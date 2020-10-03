module.exports = (sequelize, Sequelize) => {
    const alerts = sequelize.define("outlet_alerts", {
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
      tableName:'outlet_alerts'
    });
    return alerts;
  };
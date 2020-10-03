module.exports = (sequelize, Sequelize) => {
    const slotTimings = sequelize.define("slot_timings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      timings: {
        type: Sequelize.STRING
      },
      vendor_id:{
        type:Sequelize.INTEGER,
      },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'slot_timings'
    });
    return slotTimings;
  };
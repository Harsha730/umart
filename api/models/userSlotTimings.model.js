module.exports = (sequelize, Sequelize) => {
    const userSlotTimings = sequelize.define("user_slot_timings", {
        booking_id: {
        type: Sequelize.INTEGER,
      },
      slot_id: {
        type: Sequelize.INTEGER
      },
    },{
      timestamps: false,
      freezeTableName: true,
      tableName: 'user_slot_timings'
    });
    return userSlotTimings;
  };

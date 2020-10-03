module.exports = (sequelize, Sequelize) => {
    const vendorCalender = sequelize.define("vendor_calender", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      day: {
        type: Sequelize.STRING
      },
      hours: {
        type: Sequelize.STRING
      },
      is_closed: {
        type: Sequelize.BOOLEAN
      },
      vendor_id: {
        type: Sequelize.STRING
      },parent_day: {
        type: Sequelize.STRING
      },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName:'vendor_calender'
    });
    return vendorCalender;
  };
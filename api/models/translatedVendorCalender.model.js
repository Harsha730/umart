module.exports = (sequelize, Sequelize) => {
    const translated_vendor_calender = sequelize.define("translated_vendor_calender", {
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
        type: Sequelize.INTEGER
      },locale:{
          type:Sequelize.CHAR
      },parent_day: {
        type: Sequelize.STRING
      },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName:'translated_vendor_calender'
    });
    return translated_vendor_calender;
  };
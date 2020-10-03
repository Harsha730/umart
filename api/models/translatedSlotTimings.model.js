module.exports = (sequelize, Sequelize) => {
    const translated_slot_timings = sequelize.define("translated_slot_timings", {
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
      locale:{
        type:Sequelize.CHAR
      },
      parent_id:{
        type:Sequelize.INTEGER
      }   
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'translated_slot_timings'
    });
    return translated_slot_timings;
  };
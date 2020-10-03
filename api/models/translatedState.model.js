module.exports = (sequelize, Sequelize) => {
  const translated_state = sequelize.define("translated_state", {
    state_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    country_id: {
      type: Sequelize.INTEGER
    },parent_state_id:{
      type:Sequelize.INTEGER
   },locale:{
     type:Sequelize.CHAR
   }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_state'
  });
  return translated_state;
};
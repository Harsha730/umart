module.exports = (sequelize, Sequelize) => {
  const translated_city = sequelize.define("translated_city", {
    city_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    state_id: {
      type: Sequelize.INTEGER
    },
    parent_city_id:{
      type:Sequelize.INTEGER
    },locale:{
      type:Sequelize.CHAR
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_city'
  });
  return translated_city;
};
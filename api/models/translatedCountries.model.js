module.exports = (sequelize, Sequelize) => {
  const translated_country = sequelize.define("translated_country", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    code: {
      type: Sequelize.STRING
    },parent_country_id:{
       type:Sequelize.INTEGER
    },locale:{
      type:Sequelize.CHAR 
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_country'
  });
  return translated_country;
};
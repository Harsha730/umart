module.exports = (sequelize, Sequelize) => {
  const translated_product_family = sequelize.define("translated_product_family", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    parent_id: {
      type: Sequelize.INTEGER
    },vendor_id: {
      type: Sequelize.INTEGER
    },
    parent_family_id:{
        type: Sequelize.INTEGER
    },locale:{
      type:Sequelize.CHAR
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_product_family'
  });
  return translated_product_family;
};
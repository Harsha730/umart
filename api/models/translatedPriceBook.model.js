module.exports = (sequelize, Sequelize) => {
  const translated_price_book = sequelize.define("translated_price_book", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    vendor_id: {
      type: Sequelize.INTEGER
    },
    gst_number: {
      type: Sequelize.INTEGER
    },
    gst_percent: {
      type: Sequelize.INTEGER
    },
    locale:{
       type:Sequelize.CHAR
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_price_book'
  });
  return translated_price_book;
};
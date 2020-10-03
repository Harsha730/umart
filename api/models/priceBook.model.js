module.exports = (sequelize, Sequelize) => {
  const priceBook = sequelize.define("price_book", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_id: {
      type: Sequelize.INTEGER
    },
    gst_number: {
      type: Sequelize.CHAR
    },
    gst_slab_id: {
      type: Sequelize.INTEGER
    },
    gst_category: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'price_book'
  });
  return priceBook;
};
module.exports = (sequelize, Sequelize) => {
  const products = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sku: {
      type: Sequelize.CHAR
    },
    name: {
      type: Sequelize.STRING
    },
    short_description: {
      type: Sequelize.STRING
    },
    long_description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DOUBLE
    },
    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    vendor_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    product_family_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    small_image_path: {
      type: Sequelize.STRING
    },
    standard_image_path: {
      type: Sequelize.STRING
    },
    image_caption: {
      type: Sequelize.STRING
    },
    is_active: {
      type: Sequelize.BOOLEAN
    },
    is_deleted: {
      type: Sequelize.BOOLEAN
    },
    is_include_shipping : {
      type: Sequelize.BOOLEAN
    },
    price_book_id : {
      type: Sequelize.INTEGER
    },tags : {
      type: Sequelize.STRING
    },
    discount_price:{
      type: Sequelize.DOUBLE
    }
  }, {

    timestamps: false,
    freezeTableName: true,
    tableName: 'product'

  });

  return products;
};
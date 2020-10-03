module.exports = (sequelize, Sequelize) => {
  const translated_product = sequelize.define("translated_product", {
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
    parent_product_id :{
      type: Sequelize.INTEGER
    },
    locale :{
      type: Sequelize.CHAR
    },
  }, {

    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_product'

  });

  return translated_product;
};
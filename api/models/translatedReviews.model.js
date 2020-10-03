module.exports = (sequelize, Sequelize) => {
  const translated_reviews = sequelize.define("translated_reviews", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    rating: {
      type: Sequelize.CHAR
    },
    comment: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    ip: {
      type: Sequelize.STRING
    },
    product_id: {
      type: Sequelize.INTEGER
    },
  }, {

    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_reviews'

  });

  return translated_reviews;
};
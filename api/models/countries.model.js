module.exports = (sequelize, Sequelize) => {
  const country = sequelize.define("country", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    code: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'country'
  });
  return country;
};
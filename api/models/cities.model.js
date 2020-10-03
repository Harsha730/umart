module.exports = (sequelize, Sequelize) => {
  const city = sequelize.define("city", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    state_id: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'city'
  });
  return city;
};
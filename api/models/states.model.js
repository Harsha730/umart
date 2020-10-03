module.exports = (sequelize, Sequelize) => {
  const state = sequelize.define("state", {
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
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'state'
  });
  return state;
};
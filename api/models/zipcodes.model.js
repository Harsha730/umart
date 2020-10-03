module.exports = (sequelize, Sequelize) => {
  const zip_code = sequelize.define("zip_code", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    code: {
      type: Sequelize.CHAR
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    state_id: {
      type: Sequelize.INTEGER
    },
    city_id: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'zip_code'
  });

  return zip_code;
};
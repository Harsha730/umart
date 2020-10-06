module.exports = (sequelize, Sequelize) => {
  const features = sequelize.define("features", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    is_active:{
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'features'
  });
  return features;
};
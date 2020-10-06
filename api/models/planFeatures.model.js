module.exports = (sequelize, Sequelize) => {
  const plan_features = sequelize.define("plan_features", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    plan_id: {
      type: Sequelize.INTEGER
    },
    feature_id:{
      type: Sequelize.INTEGER,
    },
    feature_condition: {
      type: Sequelize.INTEGER
    }, 
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'plan_features'
  });
  return plan_features;
};
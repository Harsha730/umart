module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define("admin", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    is_approved: {
      type: Sequelize.INTEGER
    },
    secret_key: {
      type: Sequelize.INTEGER
    },
    timestamp: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'admin'
  });
  return admin;
};
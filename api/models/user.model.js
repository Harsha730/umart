module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    booking_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    attendies_count: {
      type: Sequelize.INTEGER
    },
    date: {
      type: Sequelize.STRING
    },
    time_slot: {
      type: Sequelize.INTEGER
    },
    vendor_id: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.BOOLEAN
    },
    user_status: {
      type: Sequelize.STRING
    },
    comments:{
      type:Sequelize.STRING
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'user'
  });

  return user;

};
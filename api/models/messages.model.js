module.exports = (sequelize, Sequelize) => {
    const message = sequelize.define("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      message_key: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'messages'
    });
    return message;
  };
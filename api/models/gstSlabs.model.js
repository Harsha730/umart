module.exports = (sequelize, Sequelize) => {
  const gst_slabs = sequelize.define("gst_slabs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    percent: {
      type: Sequelize.CHAR
    },
    value: {
      type: Sequelize.DOUBLE
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'gst_slabs'
  });
  return gst_slabs;
};
module.exports = (sequelize, Sequelize) => {
  const vendor_plan = sequelize.define("vendor_plan", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    vendor_id: {
      type: Sequelize.INTEGER
    },
    plan_id: {
      type: Sequelize.INTEGER
    },
    start_date: {
      type: Sequelize.STRING
    },
    end_date: {
      type: Sequelize.STRING
    },
    is_active: {
      type: Sequelize.BOOLEAN
    },
    payment_status: {
      type: Sequelize.STRING
    },
    updated_date: {
      type: Sequelize.STRING
    },
    updated_person: {
      type: Sequelize.STRING
    },
    payment_updated_date:{
      type: Sequelize.STRING
    },
    in_trail_period:{
      type :Sequelize.BOOLEAN
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'vendor_plan'
  });

  return vendor_plan;
};
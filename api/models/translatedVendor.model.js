module.exports = (sequelize, Sequelize) => {
  const translated_vendor = sequelize.define("translated_vendor", {
    qr_code: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    company_name: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    company_address: {
      type: Sequelize.STRING
    },
    zip_code: {
      type: Sequelize.STRING
    },
    language: {
      type: Sequelize.STRING
    },
    submitted_date: {
      type: Sequelize.STRING
    },
    updated_date: {
      type: Sequelize.STRING
    },
    site: {
      type: Sequelize.STRING
    },
    is_approved: {
      type: Sequelize.BOOLEAN
    },
    comments: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    },
    secret_key: {
      type: Sequelize.INTEGER
    },
    timestamp: {
      type: Sequelize.INTEGER
    },
    short_name:{
      type:Sequelize.STRING
    },
    description:{
      type:Sequelize.STRING
    },story:{
      type:Sequelize.STRING
    },
    country_id:{
      type:Sequelize.INTEGER
    },
    state_id:{
      type:Sequelize.INTEGER
    },
    city_id:{
      type:Sequelize.INTEGER
    },
    logo:{
      type:Sequelize.STRING
    },
    show_logo:{
      type:Sequelize.BOOLEAN
    },
    locale:{
      type:Sequelize.CHAR
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'translated_vendor'
  });
  return translated_vendor;
};
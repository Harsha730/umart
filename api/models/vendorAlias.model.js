module.exports = (sequelize, Sequelize) => {
    const vendorAlias = sequelize.define("vendor_alias", {
        qr_code: {
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
        submitted_date: {
            type: Sequelize.STRING
        },
        updated_date: {
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
        vendor_id: {
            type: Sequelize.INTEGER
        }, is_admin: {
            type: Sequelize.BOOLEAN
        },is_outlet_display: {
            type: Sequelize.BOOLEAN
        },is_payment_contact: {
            type: Sequelize.BOOLEAN
        },is_phone_verified: {
            type: Sequelize.BOOLEAN
        },is_email_verified: {
            type: Sequelize.BOOLEAN
        },created_by: {
            type: Sequelize.STRING
        },updated_by: {
            type: Sequelize.STRING
        },privacy_mode: {
            type: Sequelize.STRING
        },payment_method: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'vendor_alias'
    });
    return vendorAlias;
};
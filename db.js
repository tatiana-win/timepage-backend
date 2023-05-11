const { Sequelize } = require("sequelize");

const DB_URL = `postgresql://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:5432/${process.env.DB_NAME}`;

// Connection parameters
const sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres'
});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = { sq: sequelize, testDbConnection };

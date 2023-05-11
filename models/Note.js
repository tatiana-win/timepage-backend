const { sq } = require("../db");
const { DataTypes } = require("sequelize");
const {User} = require("./User");

const Note = sq.define("note", {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
    },

    color: {
        type: DataTypes.STRING,
    },

    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    date: {
        type: DataTypes.DATE,
    },
});

Note.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
    constraints: false,
});

Note.sync();

module.exports = { Note };
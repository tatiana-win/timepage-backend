const { sq } = require("../db");
const { DataTypes } = require("sequelize");
const { Note } = require("./Note");
const { User } = require("./User");

const CompletedEvent = sq.define("completedEvent", {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

CompletedEvent.belongsTo(Note, {
    foreignKey: "noteId",
    targetKey: "id",
    constraints: false,
});

CompletedEvent.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
    constraints: false,
});

CompletedEvent.sync();

module.exports = { CompletedEvent };

const { sq } = require("../db");
const { DataTypes, ENUM } = require("sequelize");
const { Note } = require("./Note");
const {User} = require("./User");

const RepeatEvent = sq.define("repeatEvent", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dayOfWeek: {
        type: ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
    },
    day: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 31
        }
    },
    date: {
        type: DataTypes.DATE,
    },
    originalDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

RepeatEvent.belongsTo(Note, {
    foreignKey: "noteId",
    targetKey: "id",
    constraints: false,
});

RepeatEvent.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
    constraints: false,
});

RepeatEvent.sync();

module.exports = { RepeatEvent };

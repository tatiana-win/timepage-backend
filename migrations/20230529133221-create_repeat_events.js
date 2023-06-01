'use strict';
const { DataTypes, ENUM } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('repeatEvents', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      noteId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dayOfWeek: {
        type: ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
      },
      day: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 2
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('repeat-events');
  }
};
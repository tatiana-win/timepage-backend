'use strict';
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notes', {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notes');
  }
};
'use strict';

const {ENUM} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'notes', // table name
          'repeatable', // new field name
          {
            type: Sequelize.BOOLEAN,
          },
      ),
      queryInterface.addColumn(
          'notes', // table name
          'period', // new field name
          {
            type: Sequelize.ENUM('week', 'month', 'year'),
          },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('notes', 'repeatable'),
      queryInterface.removeColumn('notes', 'period'),
    ]);
  }
};

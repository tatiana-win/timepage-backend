'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'notes', // table name
          'hasTime', // new field name
          {
            type: Sequelize.BOOLEAN,
          },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('notes', 'hasTime'),
    ]);
  }
};

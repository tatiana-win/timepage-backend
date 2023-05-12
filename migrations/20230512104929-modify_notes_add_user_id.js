'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'notes', // table name
          'userId', // new field name
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('notes', 'userId'),
    ]);
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'repeatEvents', // table name
          'createdAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'repeatEvents', // table name
          'updatedAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      )
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('repeatEvents', 'createdAt'),
      queryInterface.removeColumn('repeatEvents', 'updatedAt')
    ]);
  }
};

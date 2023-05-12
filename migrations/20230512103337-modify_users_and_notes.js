'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'users', // table name
          'createdAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'users', // table name
          'updatedAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'notes', // table name
          'createdAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'notes', // table name
          'updatedAt', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'createdAt'),
      queryInterface.removeColumn('users', 'updatedAt'),
      queryInterface.removeColumn('notes', 'createdAt'),
      queryInterface.removeColumn('notes', 'updatedAt'),
    ]);
  }
};

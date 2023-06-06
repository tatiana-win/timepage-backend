'use strict';

const {DataTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return Promise.all([
      queryInterface.addColumn(
          'repeatEvents', // table name
          'deletedDates', // new field name
          {
            type: DataTypes.ARRAY(DataTypes.DATE),
            defaultValue: []
          }
      )]
  },

  async down (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('repeatEvents', 'deletedDates')
    ]);
  }
};

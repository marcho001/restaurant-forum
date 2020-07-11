'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'totalViews',{
        type: Sequelize.INTEGER,
        defaultValue: 0
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },
 
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'totalViews')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

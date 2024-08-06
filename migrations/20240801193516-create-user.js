'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      FirstName: {
        type: Sequelize.STRING
      },
      Password: {
        type: Sequelize.STRING
      },
      Email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      RefreshToken:{
        type: Sequelize.STRING
      },
      Classes: {
        type: Sequelize.STRING
      },
      Roles:{
        type: Sequelize.INTEGER,
        defaultValue: 200
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
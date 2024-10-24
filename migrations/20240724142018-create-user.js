'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Class', {
      ClassCode: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      ClassTimeCode:{
        type: Sequelize.STRING
      },
      ClassTimeFull:{
        type: Sequelize.STRING
      },
      ClassName: {
        type: Sequelize.STRING
      },
      ClassRequirements: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('Class');
  }
};
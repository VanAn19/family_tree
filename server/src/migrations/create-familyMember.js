'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FamilyMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      familyTreeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FamilyTrees',
          key: 'id'
        }
      },
      fatherId: {
        type: Sequelize.INTEGER
      },
      motherId: {
        type: Sequelize.INTEGER
      },
      partnerId: {
        type: Sequelize.INTEGER
      },
      childrenId: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      name: {
        type: Sequelize.STRING
      },
      citizenIdentification: {
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      relationship: {
        type: Sequelize.STRING
      },
      job: {
        type: Sequelize.STRING
      },
      isAlive: {
        type: Sequelize.BOOLEAN
      },
      deathOfBirth: {
        type: Sequelize.DATE
      },
      isAncestor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('FamilyMembers');
  }
};
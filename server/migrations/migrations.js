'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('"InstalledEquipments"', 'agreement_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: '"Agreements"',
        key: 'agreement_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('"InstalledEquipments"', 'agreement_id');
  }
};
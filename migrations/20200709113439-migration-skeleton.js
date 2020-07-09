'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn('article', 'first_image',
                {
                    type: Sequelize.DataTypes.STRING,
                    "underscored": true
                },
                { transaction }
            )
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down (queryInterface, Sequelize) {
        try {
            const transaction = await queryInterface.sequelize.transaction();
            await queryInterface.removeColumn('article', 'first_image', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
};

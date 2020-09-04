const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Label extends Model {}

Label.init({
    type: Sequelize.INTEGER,
    label: Sequelize.STRING
}, {
    tableName: 'label',
    sequelize,
    indexes: [
        {
            name: 'type',
            fields: ['type']
        }
    ]
})

module.exports = {
    Label
}
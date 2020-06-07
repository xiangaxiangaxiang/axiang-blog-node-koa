const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Statistics extends Model {}

Statistics.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: Sequelize.STRING,
    webHits: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    comments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    articleHits: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'statistics'
})
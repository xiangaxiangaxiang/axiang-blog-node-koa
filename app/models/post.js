const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Post extends Model {}

Post.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: Sequelize.STRING,
    urls: Sequelize.STRING,
    type: Sequelize.INTEGER,
    likeNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'post'
})

module.exports = {Post}
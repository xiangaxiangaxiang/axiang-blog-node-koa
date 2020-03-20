const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Article extends Model {

}

Article.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        require: true
    },
    article_type: {
        type: Sequelize.INTEGER,
        require: true
    },
    lables: Sequelize.STRING,
    content: {
        type: Sequelize.TEXT('long'),
        require: true
    }
})

module.exports = {
    Article
}
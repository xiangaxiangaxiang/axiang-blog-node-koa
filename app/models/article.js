const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Article extends Model {
    // 删除文章
    static async deleteArticle(id) {
        const article = await Article.findOne({
            where: {
                id
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        article.destroy()
    }

    // 修改文章
    static async updateArticle(id, newArticle) {
        const article = await Article.findOne({
            where: {
                id
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        await article.update(newArticle)
    }
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
    articleType: {
        type: Sequelize.INTEGER,
        require: true
    },
    labels: Sequelize.STRING,
    content: {
        type: Sequelize.TEXT('long'),
        require: true
    }
}, {
    sequelize,
    tableName: 'article'
})

module.exports = {
    Article
}
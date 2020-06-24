const {Sequelize, Model, Op} = require('sequelize')
const { sequelize } = require('../../core/db')

class Article extends Model {

    static async getArticles(offset, limit, searchText, label) {
        let query = {
            offset,
            limit
        }
        let filter = {}
        if (searchText) {
            filter.title = {
                [Op.like]: `%${searchText}%`
            }
        }
        if (label) {
            filter.labels = {
                [Op.like]: `%${searchText}%`
            }
        }
        
        const total = await Article.count({
            where: filter
        })
        const articles = await Article.findAll(Object.assign({}, query, filter))

        return {
            total,
            articles
        }
    }

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
        await article.destroy()
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

    // 修改发布状态
    static async changePublish(id, publish) {
        const article = await Article.findOne({
            where: {
                id
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        await article.update({publish})
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
    labels: {
        type: Sequelize.STRING,
        get() {
            return JSON.parse(this.getDataValue('labels'))
        }
    },
    content: {
        type: Sequelize.TEXT('long'),
        require: true
    },
    publish: Sequelize.INTEGER,
    likeNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'article'
})

module.exports = {
    Article
}
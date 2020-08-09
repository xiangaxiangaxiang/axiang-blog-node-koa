const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Label } = require('./label')
const {unset} = require('lodash')

class Article extends Model {

    static async getArticleDetail(articleId) {
        const article = await Article.findOne({
            where: {
                articleId
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        article.increment('clickNums', {
            by: 1
        })
        unset(article, 'id')
        unset(article, 'publish')
        unset(article, 'content')

        return article
    }

    static async getArticles(offset, limit, searchText, label, articleType=null) {
        let query = {
            offset,
            limit,
            order: [['updated_at', 'DESC']]
        }
        let filter = {}
        if (searchText) {
            filter.title = {
                [Op.like]: `%${searchText}%`
            }
        }
        if (label) {
            filter.labels = {
                [Op.like]: `%${label}%`
            }
        }
        if (articleType) {
            filter.articleType = articleType
        }

        const total = await Article.count({ where: filter })
        const articles = await Article.findAll(Object.assign({}, query, { where: filter }))

        return {
            total,
            articles
        }
    }

    // 删除文章
    static async deleteArticle(articleId) {
        const article = await Article.findOne({
            where: {
                articleId
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        await article.destroy()
    }

    // 修改文章
    static async updateArticle(articleId, newArticle) {
        const article = await Article.findOne({
            where: {
                articleId
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        await article.update(newArticle)
    }

    // 修改发布状态
    static async changePublish(articleId, publish) {
        const article = await Article.findOne({
            where: {
                articleId
            }
        })
        if (!article) {
            throw new global.errs.NotFound('文章不存在')
        }
        await article.update({ publish })
    }

    static async upsertArticle(articleId, articleObj) {
        if (articleId) {
            const article = await Article.findOne({
                where: { articleId }
            })
            if (!article) {
                throw new global.errs.NotFound('文章不存在')
            }
            article.update(articleObj)
        } else {
            const article = await Article.findOne({
                where: {
                    title: articleObj.title
                }
            })
            if (article) {
                throw new global.errs.ParameterException(['文章标题已存在'])
            }
            await Article.create(articleObj)
        }
        let labels = articleObj.labels
        if (labels) {
            labels = JSON.parse(labels)
            labels.forEach(item => {
                Label.findOrCreate({
                    where: {
                        type: articleObj.articleType,
                        label: item
                    }
                })
            }) 
        }
    }

    static async getLabel(type) {
        const labels = await Label.findAll({
            where: {
                type
            }
        })
        return labels.map(item => item.label)
    }
}

Article.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    articleId: {
        type: Sequelize.STRING,
        unique: true
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
    html: {
        type: Sequelize.TEXT('long'),
        require: true
    },
    markdown: {
        type: Sequelize.TEXT('long'),
        require: true
    },
    content: {
        type: Sequelize.STRING(300),
        require: true
    },
    publish: Sequelize.INTEGER,
    likeNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    clickNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    commentsNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    firstImage: {
        type: Sequelize.STRING,
        defaultValue: ''
    }
}, {
    sequelize,
    tableName: 'article'
})

module.exports = {
    Article
}
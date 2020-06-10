const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

const { stampToStr } = require('@core/util')

class Statistics extends Model {

    static getStrTime(time=null) {
        return stampToStr(time ? time : Date.now())
    }

    // 增加网站访问量
    static async addWebHits() {
        const today = Statistics.getStrTime()
        const statistics = await Statistics.findOne({
            where: {
                date: today
            }
        })
        await statistics.increment('webHits', {
            by: 1
        })
    }

    // 增加文章点击数
    static async addArticleHits() {
        const today = Statistics.getStrTime()
        const statistics = await Statistics.findOne({
            where: {
                date: today
            }
        })
        await statistics.increment('articleHits', {
            by: 1
        })
    }

    static async updateLikes(time, type='add') {
        const date = Statistics.getStrTime(time)
        const statistics = await Statistics.findOne({
            where: {
                date
            }
        })
        if (type === 'add') {
            await statistics.increment('likes', {
                by: 1
            })
        } else {
            await statistics.decrement('likes', {
                by: 1
            })
        }
    }

    static async updateComments(time, type='add') {
        const today = Statistics.getStrTime(time)
        const statistics = await Statistics.findOne({
            where: {
                date: today
            }
        })
        if (type === 'add') {
            await statistics.increment('comments', {
                by: 1
            })
        } else {
            await statistics.decrement('comments', {
                by: 1
            })
        }
    }
}

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
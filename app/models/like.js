const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Like extends Model {
    static async like(contentID, type , uid) {
        const likeItem = await Like.findOne({
            where: {
                contentID,
                type,
                uid
            }
        })
        if (likeItem) {
            throw new global.errs.LikeError()
        }
        await Like.create({
            contentID,
            type,
            uid
        }
    }

    static async dislike(contentID, type, uid) {
        const likeItem = await Like.findOne({
            where: {
                contentID,
                type,
                uid
            }
        })
        if (!likeItem) {
            throw new global.errs.DislikeError()
        }
        await likeItem.destroy()
    }
}

Like.init({
    uid: Sequelize.INTEGER,
    contentID: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Article
}
const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Like extends Model {
    static async like(targetID, type , uid) {
        const likeItem = await Like.findOne({
            where: {
                targetID,
                type,
                uid
            }
        })
        if (likeItem) {
            throw new global.errs.LikeError()
        }
        await Like.create({
            targetID,
            type,
            uid
        }
    }

    static async dislike(targetID, type, uid) {
        const likeItem = await Like.findOne({
            where: {
                targetID,
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
    targetID: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Article
}
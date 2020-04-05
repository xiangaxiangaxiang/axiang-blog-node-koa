const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Like extends Model {
    
    static async like(targetId, type , uid) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
                type,
                uid
            }
        })
        if (likeItem) {
            throw new global.errs.LikeError()
        }
        await Like.create({
            targetId,
            type,
            uid
        })
    }

    static async dislike(targetId, type, uid) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
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
    targetId: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Like
}
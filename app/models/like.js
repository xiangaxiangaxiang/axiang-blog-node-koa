const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {Operation} = require('./operation')
const {Notification} = require('./notification')
const {NotificationType} = require('../lib/enum')
const { Statistics } = require('./statistics')

class Like extends Model {

    static async like(targetId, type, userId, replyUserId) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
                type,
                userId
            }
        })
        if (likeItem) {
            throw new global.errs.LikeError()
        }
        await sequelize.transaction(async t => {
            await Like.create({
                targetId,
                type,
                userId
            }, {transaction: t})
            Notification.addNotification(targetId, type, NotificationType.LIKE, userId, replyUserId)
            const data = await Operation.getData(targetId, type)
            await data.increment('likeNums', {
                by: 1,
                transaction: t
            })
            Statistics.updateLikes(Date.now())
        })
    }

    static async dislike(targetId, type, userId, replyUserId) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
                type,
                userId
            }
        })
        if (!likeItem) {
            throw new global.errs.DislikeError()
        }
        
        return sequelize.transaction(async t => {
            await likeItem.destroy({
                force: true,
                transaction: t
            })
            Notification.cancellationNotice(targetId, type, userId, replyUserId)
            const data = await Operation.getData(targetId, type)
            data.decrement('likeNums', {
                by: 1,
                transaction: t
            })
            Statistics.updateLikes(data.createdAt, 'subtract')
        })
    }

    static async getLikeStatus(uid, targetId) {
        const like = await Like.findOne({
            where: {
                userId: uid,
                targetId
            }
        })
        if (like) {
            return true
        }
        return false
    }
}

Like.init({
    userId: Sequelize.STRING,
    targetId: Sequelize.STRING,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Like
}
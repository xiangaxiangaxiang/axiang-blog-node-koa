const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {Operation} = require('./operation')
const {Notification} = require('./notification')
const {NotificationType} = require('../lib/enum')

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
        return sequelize.transaction(async t => {
            await Like.create({
                targetId,
                type,
                userId
            }, {transaction: t})
            await Notification.addNotification(targetId, type, NotificationType.LIKE, userId, replyUserId)
            const data = await Operation.getData(targetId, type)
            await data.increment('likeNums', {
                by: 1,
                transaction: t
            })
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
            await Notification.cancellationNotice(targetId, type, userId, replyUserId)
            const data = await Operation.getData(targetId, type)
            await data.decrement('likeNums', {
                by: 1,
                transaction: t
            })
        })
    }
}

Like.init({
    userId: Sequelize.INTEGER,
    targetId: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Like
}
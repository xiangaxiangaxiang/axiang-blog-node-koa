const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {NotificationType} = require('../lib/enum')

class Notification extends Model {

    static async getUserInfo(uid) {
        const user = await User.findOne({
            where: {
                id: uid
            }
        })
        if(!user) {
            throw new global.errs.NotFound('账号不存在')
        }
        return {
            uid,
            nickname: user.nickname,
            avatar: user.avatar
        }
    }

    static async cancellationNotice(targetId, targetType, operationUserId, userId) {
        const notification = await Notification.findOne({
            targetId,
            targetType,
            operationUserId,
            userId,
            type: NotificationType.LIKE
        })
        // 只有点赞的通知可以被删除，评论的通知不会被删除
        if (notification) {
            await notification.destroy()
        }
    }

    static async addNotification(targetId, targetType, type, operationUserId, userId) {
        const operationUserInfo = Notification.getUserInfo(operationUserId)
        const notification = {
            targetId,
            targetType,
            type,
            operationUserId,
            operationUserInfo,
            userId
        }
        Notification.create(notification)
    }

    static async getNotification(uid) {
        const likes = await Notification.findAll({
            where: {
                userId: uid,
                type: NotificationType.LIKE
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
        const comments = await Notification.findAll({
            where: {
                userId: uid,
                type: NotificationType.COMMENT
            }
        })
        const res = {
            likeNums: likes.length,
            lastLikeUser: likes[0] ? JSON.parse(likes[0].operationUserInfo) : {},
            comments: comments
        }
        // for (let i = 0; i< comments.length; i++) {
        //     let comment = comments[i]
        //     let item = {
        //         targetId: comment.targetId,
        //         targetType: comment.targetType,
        //         operationUserInfo: JSON.parse(comment.operationUserInfo)
        //     }
        //     res.commentList.push(item)
        // }
        return res
    }

    static async read(uid, type) {
        await Notification.update({
            unread: 0
        }, {
            where: {
                userId: uid,
                type
            }
        })
    }
}

Notification.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    targetId: Sequelize.INTEGER,
    // 目标类型，比如文章，动态或者评论
    targetType: Sequelize.INTEGER,
    // 评论还是点赞
    type: Sequelize.INTEGER,
    operationUserId: Sequelize.INTEGER,
    operationUserInfo: Sequelize.STRING,
    userId: Sequelize.INTEGER,
    unread: {
        type: Sequelize.INTEGER,
        // 默认为1，未读为0
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'notification'
})

module.exports = {Notification}
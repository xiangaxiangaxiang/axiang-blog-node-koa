const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {NotificationType, OperationType} = require('../lib/enum')
const { User } = require('@models/user')
const { Operation } = require('@models/operation')

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

    static async getUnreadNums(uid) {
        const nums = await Notification.count({
            where: {
                userId: uid,
                unread: 1
            }
        })
        return {
            nums
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
        const notification = {
            targetId,
            targetType,
            type,
            operationUserId,
            userId
        }
        Notification.create(notification)
    }

    static async getNotification(uid, type, limit, offset) {
        Notification.update({
            unread: 0
        }, {
            where: {
                userId: uid
            }
        })
        const notices = await Notification.findAll({
            where: {
                userId: uid,
                type
            },
            limit,
            offset,
            order: [
                ['unread', 'DESC'],
                ['created_at', 'DESC']
            ]
        })
        let operationUserIds = [],
            commentIds = []
        notices.forEach(item => {
            operationUserIds.push(item.operationUserId)
            commentIds.push(item.targetId)
        })
        const users = await User.findAll({
            where: {
                uid: [... new Set(operationUserIds)]
            }
        })
        const comments = await Operation.getAllData([... new Set(commentIds)], OperationType.COMMENT)
        const res = this.formatData(notices, users, comments)
        return res
    }

    static formatData(notices, users, comments) {
        let res = []
        notices.forEach(notice => {
            let item = {
                targetType: notice.targetType,
                targetId: notice.targetId,
                unread: notice.unread,
                targetName: ''
            }
            for (let i = 0; i < users.length; i++) {
                if (notice.operationUserId === users[i].uid) {
                    item.operationUser = users[i].nickname
                    break
                }
            }
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].uniqueId === notice.targetId) {
                    item.targetName = comments[i].content
                    break
                }
            }
            res.push(item)
        })
        return res
    }
}

Notification.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    targetId: Sequelize.STRING,
    // 目标类型，比如文章，动态或者评论
    targetType: Sequelize.INTEGER,
    // 评论还是点赞
    type: Sequelize.INTEGER,
    operationUserId: Sequelize.STRING,
    userId: Sequelize.STRING,
    unread: {
        type: Sequelize.INTEGER,
        // 默认为1，已读为0
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'notification'
})

module.exports = {Notification}
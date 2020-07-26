const {Sequelize, Model, Op} = require('sequelize')

const { sequelize } = require('../../core/db')
const {User} = require('@models/user')
const {randomStr} = require('../lib/random')
const {Notification} = require('./notification')
const {NotificationType, UserType, OperationType} = require('../lib/enum')

class Comment extends Model {
    static async addComment(targetId, content, uid, commentId, replyUserId, type) {
        // const userInfo = await Comment.getUserInfo(uid)
        let replyUserInfo = {}
        if (replyUserId) {
            // 判断评论是否存在
            const comment = await Comment.findOne({where: {commentId}})
            if (!comment) {
                throw new global.errs.NotFound('评论不存在')
            }
        }
        const comment = {
            commentId: commentId ? commentId : randomStr(),
            targetId,
            content,
            userId: uid
        }
        if (replyUserId) {
            comment.replyUserId = replyUserId
        }
        await Notification.addNotification(targetId, type, NotificationType.COMMENT, uid, replyUserId)
        await Comment.create(comment)
    }

    static async getUserInfo(uid) {
        const user = await User.findOne({
            where: {
                uid: uid
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

    static async deleteComment(id, uid, userType) {
        const comment = await Comment.findOne({
            where: {
                id
            }
        })
        if (!comment) {
            throw new global.errs.NotFound('评论不存在')
        }
        const userInfo = JSON.parse(comment.userInfo)
        if (userInfo.uid !== uid && userType !== UserType.ADMIN) {
            throw new global.errs.AuthFailed('不能删除别人的评论-o-')
        }
        await comment.update({content: '该评论已被删除', isDeleted: 1})
    }

    static async getCommentList(offset, limit, searchText) {
        let query = {
            offset,
            limit
        }
        let filter = {
            isDeleted: 0
        }
        if (searchText) {
            filter.content = {
                [Op.like]: `%${searchText}%`
            }
        }

        const total = await Comment.count({where: filter})
        const commentList = await Comment.findAll(Object.assign({}, query, {where: filter}))

        return {
            total,
            commentList
        }
    }
    
    async getComment(targetId) {
        const comments = await Comment.findAll({
            where: {
                targetId
            },
            order: [
                ['updated_at', 'DESC']
            ]
        })
        // return comments
        // 创建commentId数据和新数组用来整合数据
        const commentIdArr = []
        const dataArr = []
        for (let i = 0;i < comments.length;i++) {
            let commentId = comments[i].commentId
            let index = commentIdArr.indexOf(commentId)
            let comment = comments[i]
            if (index < 0) {
                const topComment = {
                    id: comment.id,
                    commentId: comment.commentId,
                    targetId: comment.targetId,
                    content: comment.content,
                    userInfo: comment.userInfo,
                    replyUserInfo: comment.replyUserInfo,
                    likeNums: comment.likeNums,
                    comments: []
                }
                dataArr.push(topComment)
                commentIdArr.push(commentId)
            } else {
                dataArr[index].comments.push(comment)
            }
        }
        return dataArr
    }
}

Comment.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    commentId: {
        type: Sequelize.STRING,
        require: true,
    },
    targetId: Sequelize.INTEGER,
    content: Sequelize.STRING,
    userId: Sequelize.STRING,
    replyUserId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isDeleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    likeNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'comment'
})

module.exports = {
    Comment
}
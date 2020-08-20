const {Sequelize, Model, Op} = require('sequelize')

const { sequelize } = require('../../core/db')
const {User} = require('./user')
const {Article} = require('./article')
const {randomStr} = require('../lib/random')
const {Notification} = require('./notification')
const {NotificationType, UserType, OperationType} = require('../lib/enum')
const { Statistics } = require('./statistics')

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
            uniqueId: randomStr(),
            commentId: commentId ? commentId : randomStr(),
            targetId,
            content,
            userId: uid
        }
        if (replyUserId) {
            comment.replyUserId = replyUserId
        }
        sequelize.transaction(async t => {
            await Comment.create(comment, {transaction: t})
            await Notification.addNotification(targetId, type, NotificationType.COMMENT, uid, replyUserId)
            const article = await Article.findOne({
                where: {
                    articleId: targetId
                }
            })
            await article.increment('commentsNums', {
                by: 1,
                transaction: t
            })
            Statistics.updateComments()
        })
    }

    // static async getUserInfo(uid) {
    //     const user = await User.findAll({
    //         where: {
    //             uid: uid
    //         }
    //     })
    //     if(!user) {
    //         throw new global.errs.NotFound('账号不存在')
    //     }
    //     return {
    //         uid,
    //         nickname: user.nickname,
    //         avatar: user.avatar
    //     }
    // }

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

    static async getCommentList(offset, limit) {
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

    static async getUserInfo(ids) {
        const users = await User.findAll({
            where: {
                uid: [...new Set(ids)]
            },
            attributes: ['uid', 'nickname', 'avatar']
        })
        return users
    }
    
    static async getComment(targetId) {
        const comments = await Comment.findAll({
            where: {
                targetId
            },
            order: [
                ['updated_at', 'DESC']
            ]
        })
        const userIdList = []
        comments.forEach(item => {
            userIdList.push(item.userId)
            if (item.replyUserId) {
                userIdList.push(item.replyUserId)
            }
        })
        const userInfoList = await this.getUserInfo(userIdList)
        // return comments
        // 创建commentId数据和新数组用来整合数据
        const commentIdArr = []
        const dataArr = []
        for (let i = 0;i < comments.length;i++) {
            let commentId = comments[i].commentId
            let index = commentIdArr.indexOf(commentId)
            let comment = {
                uniqueId: comments[i].uniqueId,
                commentId: comments[i].commentId,
                targetId: comments[i].targetId,
                content: comments[i].content,
                likeNums: comments[i].likeNums,
                createdTime: comments[i].created_at
            }
            for (let j in userInfoList) {
                if (userInfoList[j].uid === comments[i].userId) {
                    comment.userInfo = userInfoList[j]
                }
                if (userInfoList[j].uid === comments[i].replyUserId) {
                    comment.replyUserInfo = userInfoList[j]
                }
                if (comment.userInfo && (!comments[i].replyUserId || (comments[i].replyUserId && comment.replyUserInfo) )) {
                    break
                }
            }
            if (index < 0) {
                comment.replyComments = []
                dataArr.push(comment)
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
    uniqueId: {
        type: Sequelize.STRING,
        unique: true,
    },
    commentId: {
        type: Sequelize.STRING,
        require: true,
    },
    targetId: Sequelize.STRING,
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
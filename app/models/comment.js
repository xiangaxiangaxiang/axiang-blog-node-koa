const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {User} = require('@models/user')

class Comment extends Model {
    static async AddComment(targetID, content, uid, commentID, replyUserID) {
        // const comment = {}
    }

    static async getUserInfo(uid) {
        const user = await User.findOne({
            where: {
                uid
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
}

Comment.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    commentID: {
        type: Sequelize.INTEGER,
        require: true
        unique,
    },
    targetID: Sequelize.INTEGER,
    content: Sequelize.STRING,
    userInfo: Sequelize.STRING,
    replyUserInfo: Sequelize.STRING
}, {
    sequelize,
    tableName: 'comment'
})
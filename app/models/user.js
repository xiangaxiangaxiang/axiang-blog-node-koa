const bcrypt = require('bcryptjs')
const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class User extends Model {

    static async verifyAccount(account, password) {
        const user = await User.findOne({
            where: {
                account
            }
        })
        if (!user) {
            throw new global.errs.NotFound('账号不存在')
        }
        if (user.enable === 0) {
            throw new global.errs.AuthFailed('账号已被禁用')
        }
        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }

    static async updateUser(id, nickname, password, avatar) {
        const user = await User.findOne({
            where: {
                id
            }
        })
        if (!user) {
            throw new global.errs.NotFound('账号不存在')
        }
        const userInfo = {
            nickname: nickname ? nickname : user.nickname,
            password: password ? password: user.password,
            avatar: avatar ? avatar : user.avatar,
        }
        return await User.update(userInfo, {
            where: {
                id
            }
        })
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING(32),
    avatar: Sequelize.STRING,
    account: {
        type: Sequelize.STRING(16),
        unique: true
    },
    user_type: Sequelize.INTEGER,
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    enable: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'user'
})

module.exports = {
    User
}
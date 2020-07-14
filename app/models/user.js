const bcrypt = require('bcryptjs')
const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const { UserType } = require('../lib/enum')

class User extends Model {

    static async createUser(userInfo) {
        const user = await User.findOne({
            where: {
                account: userInfo.account
            }
        })
        if (user) {
            throw new global.errs.ParameterException('账号已被注册')
        }
        return await User.create(userInfo)
    }

    // 默认id升序排列
    static async getUserList(offset, limit, sort='id', order='ASC') {
        const userList = await User.findAll({
            offset,
            limit,
            order: [[sort, order]]
        })
        const total = await User.count()
        return {
            userList,
            total
        }
    }

    // 验证账号
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

    // 验证管理员账号
    static async verifyAdmin(account, password) { 
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
        if (user.userType !== UserType.ADMIN) {
            throw new global.errs.AuthFailed('该账号无权登陆')
        }
        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }

    // 修改用户信息
    static async updateUser(id, nickname, password) {
        const user = await User.findOne({
            where: {
                id
            }
        })
        if (!user) {
            throw new global.errs.NotFound('账号不存在')
        }
        if (password) {
            const correct = bcrypt.compareSync(password, user.password)
            if (!correct) {
                throw new global.errs.AuthFailed('密码不正确')
            }
        }
        const userInfo = {
            nickname: nickname ? nickname : user.nickname,
            password: password ? password: user.password,
            avatar: user.avatar,
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
    userType: Sequelize.INTEGER,
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
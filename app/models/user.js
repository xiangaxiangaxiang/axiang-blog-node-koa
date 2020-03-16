const bcrypt = require('bcryptjs')
const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class User extends Model {
    static async verifyPassword(account, password) {
        const user = await User.findOne({
            where: {
                account
            }
        })
        if (!user) {
            throw new global.errs.NotFound('账号不存在')
        }
        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
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
}, {
    sequelize,
    tableName: 'user'
})

module.exports = {
    User
}
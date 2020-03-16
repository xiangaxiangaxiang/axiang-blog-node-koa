const {LinValidator, Rule} = require('../../core/lin-validator')
const {User} = require('@models/user')

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '账号至少6个字符，最多16个字符', {
                min: 6,
                max: 16
            })
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            })
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 2,
                max: 32
            })
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }

    async validateEmail(vals) {
        const account = vals.body.account
        const user = await User.findOne({
            where: {
                account: account
            }
        })
        if (user) {
            throw new Error('账号已存在')
        }
    }
}

class LoginValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '账号至少6个字符，最多16个字符', {
                min: 6,
                max: 16
            })
        ]
        this.password = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            })
        ]
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', {min: 1})
        ]
    }
}

module.exports = {
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator
}
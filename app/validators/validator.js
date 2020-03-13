const {LinValidator, Rule} = require('../../core/lin-validator')

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '账号至少6个字符，最多16个字符', {})
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
                min: 4,
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

    async validateAccount(vals) {
        const account = vals.body.account
        const user = await User.findOne({
            where: {
                account: account
            }
        })
        if (user) {
            throw new Error('Email 已存在')
        }
    }
}
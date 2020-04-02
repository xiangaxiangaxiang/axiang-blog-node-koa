const {LinValidator, Rule} = require('../../core/lin-validator')
const {User} = require('@models/user')

// 创建用户
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

    async validateAccount(vals) {
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

// 登陆验证
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

// 非空验证
class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', {min: 1})
        ]
    }
}

// 更新用户信息
class UpdateUserValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', 'ID是必须参数')
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('isOptional', '')
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 2,
                max: 32
            }),
            new Rule('isOptional', '')
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }
}

// 超级管理员注册
class AdminRegisterValidator extends RegisterValidator {
    constructor() {
        super()
        this.secret = [
            new Rule('isLength', '必须输入密令', {min: 1})
        ]
    }

    validateSecret(vals) {
        const secret = vals.body.secret
        if (secret !== global.config.adminSecret) {
            throw new Error('密令不正确')
        }
    }
}

// 添加文章
class AddArticleValidator extends LinValidator {
    constructor() {
        super()
        this.title = [
            new Rule('isLength', '标题长度为2-32', {min: 2, max: 32})
        ]
        this.articleType = [
             new Rule('isInt', '文章类型为数字', {})
        ]
        this.labels = [
            new Rule('isLength', '至少选择一个标签', {min: 1})
        ]
    }
}

// 修改文章
class ModifyArticleValidator extends AddArticleValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', 'ID是必须参数')
        ]
    }
}

// 点赞判断
class LikeValidator extends LinValidator{
    constructor() {
        super()
        this.contentID = [
            new Rule('isInt', 'ID不能为空')
        ]
        this.type = [
            new Rule('isInt', '类型不能为空')
        ]
    }
}

module.exports = {
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator,
    UpdateUserValidator,
    AdminRegisterValidator,
    AddArticleValidator,
    ModifyArticleValidator,
    LikeValidator
}
const {LinValidator, Rule} = require('../../core/lin-validator')
const {User} = require('@models/user')
const { PostType } = require('../lib/enum')

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
            new Rule('isInt', 'Id是必须参数')
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
            new Rule('isInt', 'Id是必须参数')
        ]
    }
}

// 点赞判断
class LikeValidator extends LinValidator{
    constructor() {
        super()
        this.targetId = [
            new Rule('isInt', 'Id不能为空')
        ]
        this.type = [
            new Rule('isInt', '类型不能为空')
        ]
    }
}

// 评论判断

class CommentValidator extends LinValidator {
    constructor() {
        super()
        this.targetId = [
            new Rule('isInt', 'targetId是必须参数')
        ]
        this.content = [
            new Rule('isLength', '评论超过最大长度', {min: 1, max: 256})
        ]
        this.replyUserId = [
            new Rule('isOptional', ''),
            new Rule('isInt', '回复用户Id格式不正确')
        ]
    }
}

// id 检测
class IdValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', 'ID是必须参数')
        ]
    }
}

class PostValidator extends LinValidator{
    constructor() {
        this.content = [
            new Rule('isOptional', ''),
            new Rule('isLength', '长度不能超过144个字', {max: 144})
        ]
        this.type = [
            new Rule('isInt', 'type参数类型必须为数字')
        ]
    }
    validateType(vals) {
        const type = vals.body.type
        if (!PostType.isThisType(type)) {
            throw new Error('非法类型')
        }
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
    LikeValidator,
    CommentValidator,
    IdValidator,
    PostValidator
}
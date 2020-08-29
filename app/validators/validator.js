const { LinValidator, Rule } = require('../../core/lin-validator')
const { User } = require('@models/user')
const { PostType, CommentType, ArticleType, OperationType } = require('../lib/enum')

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
            new Rule('isLength', '参数不能为空', { min: 1 })
        ]
    }
}

// 更新用户信息
class UpdateUserValidator extends LinValidator {
    constructor() {
        super()
        this.uid = [
            new Rule('isLength', '参数不能为空', { min: 1})
        ]
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 2,
                max: 32
            }),
            new Rule('isOptional', '')
        ]
    }


}

class UpdatePasswordValidator extends LinValidator {
    constructor() {
        super()
        this.uid = [
            new Rule('isInt', '参数不能为空')
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('isOptional', '')
        ]
        this.password2 = this.password1
        this.oldPassword = this.password1
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
            new Rule('isLength', '必须输入密令', { min: 1 })
        ]
    }

    validateSecret(vals) {
        const secret = vals.body.secret
        if (secret !== global.config.adminSecret) {
            throw new Error('密令不正确')
        }
    }
}

// 添加或修改文章
class UpsertArticleValidator extends LinValidator {
    constructor() {
        super()
        this.title = [
            new Rule('isLength', '标题长度为2-32', { min: 2, max: 32 })
        ]
        this.articleType = [
            new Rule('isInt', '文章类型为数字', {})
        ]
        this.labels = [
            new Rule('isLength', '至少选择一个标签', { min: 1 })
        ]
        this.content = [
            new Rule('isLength', '参数不能为空', { min: 1 })
        ]
        this.html = [
            new Rule('isLength', '参数不能为空', { min: 1 })
        ]
        this.markdown = [
            new Rule('isLength', '参数不能为空', { min: 1 })
        ]
        this.articleId = [
            new Rule('isOptional', ''),
            new Rule('isLength', '参数不合法', {
                min: 1
            })
        ]
    }

    validateArticleType(vals) {
        const articleType = vals.body.articleType
        if (!ArticleType.isThisType(articleType)) {
            throw new Error('文章类型不正确')
        }
    }
}

// 修改文章
// class ModifyArticleValidator extends AddArticleValidator {
//     constructor() {
//         super()
//         this.id = [
//             new Rule('isInt', 'Id是必须参数')
//         ]
//     }
// }

// 点赞判断
class LikeValidator extends LinValidator {
    constructor() {
        super()
        this.targetId = [
            new Rule('isLength', '参数不能为空', {
                min: 1
            })
        ]
        this.type = [
            new Rule('isInt', '类型不能为空')
        ]
        this.replyUserId = [
            new Rule('isOptional', ''),
            new Rule('isLength', '类型不能为空', { min: 1 })
        ]
    }

    validateType(vals) {
        const type = vals.body.type
        if (!OperationType.isThisType(type)) {
            throw new Error('类型错误')
        }
    }
}

// 评论判断

class CommentValidator extends LinValidator {
    constructor() {
        super()
        this.targetId = [
            new Rule('isLength', '参数不能为空', {min: 1})
        ]
        this.type = [
            new Rule('isInt', '参数不能为空')
        ]
        this.content = [
            new Rule('isLength', '评论超过最大长度', { min: 1, max: 256 })
        ]
        this.replyUserId = [
            new Rule('isOptional', ''),
            new Rule('isLength', '回复用户Id格式不正确', {min: 1})
        ]
    }

    validateType(vals) {
        const type = vals.body.type
        if (!OperationType.isThisType(type)) {
            throw new Error('类型错误')
        }
    }
}

// id 检测
class IdValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '参数不能为空')
        ]
    }
}

class PostValidator extends LinValidator {
    constructor() {
        this.content = [
            new Rule('isOptional', ''),
            new Rule('isLength', '长度不能超过144个字', { max: 144 })
        ]
        this.type = [
            new Rule('isInt', '参数类型必须为数字')
        ]
    }
    validateType(vals) {
        const type = vals.body.type
        if (!PostType.isThisType(type)) {
            throw new Error('非法类型')
        }
    }
}

class PaginationsValidator extends LinValidator {
    constructor() {
        super()
        this.offset = [
            new Rule('isInt', '参数不能为空')
        ]
        this.limit = [
            new Rule('isInt', '参数不能为空')
        ]
        this.type = [
            new Rule('isOptional', ''),
            new Rule('isInt', '参数为INT')
        ]
    }
}

class ArticlePublishValidator extends LinValidator {
    constructor() {
        super()
        this.articleId = [
            new Rule('isLength', '参数不能为空', {min: 1})
        ]
        this.publish = [
            new Rule('isInt', '参数不能为空')
        ]
    }
}

class ArticleListValidator extends PaginationsValidator {
    constructor() {
        super()
        this.articleType = [
            new Rule('isInt', '参数不能为空')
        ]
        this.label = [
            new Rule('isOptional', '')
        ]
        this.searchText = [
            new Rule('isOptional', ''),
            new Rule('isLength', '参数长度为1到16', {
                min: 1,
                max: 16
            })
        ]
    }

    validateArticleType(vals) {
        const articleType = vals.query.articleType
        if (!ArticleType.isThisType(articleType)) {
            throw new global.errs.ParameterException('文章类型错误')
        }
    }
}

class TypeValidator extends LinValidator {
    constructor() {
        super()
        this.type = [
            new Rule('isInt', '参数错误')
        ]
    }
}

class ArticleIdValidator extends LinValidator {
    constructor() {
        super()
        this.articleId = [
            new Rule('isLength', '参数不能为空', {
                min: 1
            })
        ]
    }
}

class StringIdValidator extends LinValidator {
    validateStringId(vals) {
        const data = JSON.stringify(vals.body) === '{}' ? vals.query : vals.body
        let id
        for (let i in data) {
            if (i.toLowerCase().indexOf('id') > -1) {
                id = data[i]
                break
            }
        }
        const type = Object.prototype.toString.call(id)
        if (type !== '[object Number]' && type !== '[object String]') {
            throw new Error('请正确传入参数')
        }
    }
}

class GetCommentValidator extends PaginationsValidator {
    constructor() {
        super()
        this.targetId = [
            new Rule('isLength', '请传入targetID', {min: 1})
        ]
    }
}

module.exports = {
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator,
    UpdateUserValidator,
    AdminRegisterValidator,
    UpsertArticleValidator,
    LikeValidator,
    CommentValidator,
    IdValidator,
    PostValidator,
    PaginationsValidator,
    ArticlePublishValidator,
    UpdatePasswordValidator,
    ArticleListValidator,
    TypeValidator,
    ArticleIdValidator,
    StringIdValidator,
    GetCommentValidator
}
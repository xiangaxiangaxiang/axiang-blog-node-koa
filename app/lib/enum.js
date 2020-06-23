function isThisType(val) {
    for (let key in this) {
        if (this[key] == val) {
            return true
        }
    }
    return false
}

// 用户类型
const UserType = {
    TOURIST: 10,
    USER: 100,
    ADMIN: 200,
    isThisType
}

// 动态类型
const PostType = {
    isThisType,
    VIDEO: 100,
    PICTURE: 200,
    ARTICLE: 300
}

// 操作类型
const OperationType = {
    isThisType,
    ARTICLE: 100,
    POST: 200,
    COMMENT: 300
}

const NotificationType = {
    isThisType,
    COMMENT: 100,
    LIKE: 200
}

const ArticleType = {
    isThisType,
    TECHNICAL: 100,
    LIFE: 200,
    DREAM: 300
}

module.exports = {
    UserType,
    PostType,
    OperationType,
    NotificationType,
    ArticleType
}
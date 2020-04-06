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

module.exports = {
    UserType,
    PostType,
    OperationType
}
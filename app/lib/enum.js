function isThisType(val) {
    for (let key in this) {
        if (this[key] == val) {
            return true
        }
    }
    return false
}

const UserType = {
    USER: 100,
    ADMIN: 200,
    isThisType
}

module.exports = {
    UserType
}
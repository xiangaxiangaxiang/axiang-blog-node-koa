const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
    constructor() {
        Auth.USER = 99
        Auth.ADMIN = 199
    }

    // 验证token
    _verifyToken(userToken) {
        let errMsg = 'token不合法'
        if (!userToken || !userToken.name) {
            throw new global.errs.Forbbiden(errMsg)
        }
        try {
            // 解码token
            var decode = jwt.verify(userToken.name, global.config.security.secretKey)
        } catch (error) {
            if (error.name == 'TokenExpireError') {
                errMsg = 'token已过期'
            }
            throw new global.errs.Forbbiden(errMsg)
        }
        return decode
    }

    get admin() {
        return async (ctx, next) => {

            const userToken = basicAuth(ctx.req)
            let decode = this._verifyToken(userToken)

            if (decode.userType < Auth.ADMIN) {
                const errMsg = '权限不足,需要管理员权限'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                userType: decode.userType
            }

            await next()
        }
    }

    get user() {
        return async (ctx, next) => {

            const userToken = basicAuth(ctx.req)
            
            let decode = this._verifyToken(userToken)

            if (decode.userType < Auth.USER) {
                const errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                userType: decode.userType
            }

            await next()
        }
    }

    get tourist() {
        return async (ctx, next) => {

            const userToken = basicAuth(ctx.req)

            if (!userToken || !userToken.name) {
                ctx.tourist = {
                    newTourist: true
                }
            } else {
                try {
                    // 解码token
                    var decode = jwt.verify(userToken.name, global.config.security.secretKey)
                    ctx.auth = {
                        uid: decode.uid,
                        userType: decode.userType
                    }
                } catch (error) {
                    if (error.name == 'TokenExpireError') {
                        errMsg = 'token已过期'
                        ctx.tourist = {
                            newTourist: false,
                            expires: true
                        }
                    }
                }
            }
            
            await next()
        }
    }

    // static verifyToken(token) {
    //     try {
    //         const v = jwt.verify(token, global.config.security.secretKey)
    //         return true
    //     } catch (error) {
    //         return false
    //     }
    // }
}

module.exports = {
    Auth
}
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
    constructor() {
        Auth.USER = 1
        Auth.ADMIN = 200
    }

    _verifyToken(userToken) {
        let errMsg = 'token不合法'
        if (!userToken || !userToken.name) {
            throw new global.errs.Forbbiden(errMsg)
        }
        try {
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

            if (decode.user_type < Auth.ADMIN) {
                const errMsg = '权限不足,需要管理员权限'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                user_type: decode.user_type
            }

            await next()
        }
    }

    get user() {
        return async (ctx, next) => {

            const userToken = basicAuth(ctx.req)
            
            let decode = this._verifyToken(userToken)

            if (decode.user_type < Auth.USER) {
                const errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                user_type: decode.user_type
            }

            await next()
        }
    }

    static verifyToken(token) {
        try {
            const v = jwt.verify(token, global.config.security.secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    Auth
}
const {HttpException} = require('../core/http-exception')

const catchError = async (ctx, next) => {
    try{
        await next()
    } catch(error) {
        const isHttpException = error instanceof HttpException
        const isDev = global.config.environment === 'dev'

        if (isDev && !isHttpException) {
            throw error
        }

        requestUrl = `${ctx.method} ${ctx.path}`
        if (isHttpException) {
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: requestUrl
            }
            ctx.status = error.code
        } else {
            console.log(error)
            ctx.body = {
                msg: 'we make a mistake',
                error_code: 999,
                request: requestUrl
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError
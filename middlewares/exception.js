const {HttpException} = require('../core/http-exception')

// 统一处理所有的错误
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
        // 如果是主动抛出的错误
        if (isHttpException) {
            ctx.body = {
                msg: error.msg,
                status: error.errorCode,
                request: requestUrl
            }
            if (error.data) {
                ctx.body.data = error.data
            }
            ctx.status = error.code
        } else { 
            // 未知错误
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
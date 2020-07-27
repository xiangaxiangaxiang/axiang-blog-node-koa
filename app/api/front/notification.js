const Router = require('koa-router')

const {Notification} = require('@models/notification')
const {Auth} = require('@middlewares/auth')
const { PaginationsValidator } = require('../../validators/validator')

const router = new Router({
    prefix: '/front/notification'
})

router.get('/', new Auth().user, async (ctx) => {
    const v = await new PaginationsValidator().validate(ctx)

    const uid = ctx.auth.uid
    const offset = v.get('query.offset')
    const limit = v.get('query.limit')
    const type = v.get('query.type')

    const notifications = await Notification.getNotification(uid, type, limit, offset)
    throw new global.errs.Success(notifications)
})

router.post('/read', new Auth().user, async (ctx) => {
    const uid = ctx.auth.uid
    const type = ctx.request.body.type
    if (!type) {
        throw new global.errs.ParameterException()
    }
    await Notification.read(uid, type)
    throw global.errs.success()
})

module.exports = router
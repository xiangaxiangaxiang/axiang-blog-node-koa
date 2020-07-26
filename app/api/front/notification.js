const Router = require('koa-router')

const {Notification} = require('@models/notification')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/notification'
})

router.get('/', new Auth().user, async (ctx) => {
    const uid = ctx.auth.uid
    const notifications = await Notification.getNotification(uid)
    ctx.body = notifications
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
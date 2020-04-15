const Router = require('koa-router')

const {Notification} = require('@models/notification')

const router = new Router({
    prefix: '/front/notification'
})

router.get('/notification', new Auth().user, async (ctx) => {
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
    thow global.errs.success()
})

module.exports = router
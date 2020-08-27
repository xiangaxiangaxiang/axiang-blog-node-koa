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
    const { offset, limit, type } = v.get('query')

    const notifications = await Notification.getNotification(uid, type, limit, offset)
    throw new global.errs.Success(notifications)
})

router.get('/unread_nums', new Auth().user, async ctx => {
    const uid = ctx.auth.uid

    const res = await Notification.getUnreadNums(uid)
    throw new global.errs.Success(res)
})

module.exports = router
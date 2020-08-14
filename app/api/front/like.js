const Router = require('koa-router')

const {LikeValidator} = require('@validator')
const {Like} = require('@models/like')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/like'
})

router.post('/', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)

    const { targetId, type, replyUserId } = v.get('body')
    const uid = ctx.auth.uid

    await Like.like(targetId, type, uid, replyUserId, type)
    throw new global.errs.Success() 
})

router.post('/dislike', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)

    const { targetId, type } = v.get('body')
    const uid = ctx.auth.uid

    await Like.dislike(targetId, type, uid)
    throw new global.errs.Success() 
})

module.exports = router
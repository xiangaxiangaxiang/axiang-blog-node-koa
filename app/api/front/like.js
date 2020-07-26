const Router = require('koa-router')

const {LikeValidator} = require('@validator')
const {Like} = require('@models/like')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/like'
})

router.post('/', async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetId = v.get('body.targetId')
    const type = v.get('body.type')
    const replyUserId = v.get('body.replyUserId')
    // const uid = ctx.auth.uid
    
    const uid = '4294b3237'

    await Like.like(targetId, type, uid, replyUserId)
    throw new global.errs.Success() 
})

router.post('/dislike', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetId = v.get('body.targetId')
    const type = v.get('body.type')
    const uid = ctx.auth.uid

    await Like.dislike(targetId, type, uid)
    throw new global.errs.Success() 
})

module.exports = router
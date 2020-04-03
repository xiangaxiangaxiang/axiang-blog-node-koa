const Router = require('koa-router')

const {LikeValidator} = require('@validator')
const {Like} = require('@models/like')

const router = new Router({
    prefix: '/front/like'
})

router.post('/', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetID = v.get('body.targetID')
    const type = v.get('body.type')
    const uid = ctx.auth.uid

    await Like.like(targetID, type, uid)
    throw new global.errs.Success() 
})

router.post('/dislike', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetID = v.get('body.targetID')
    const type = v.get('body.type')
    const uid = ctx.auth.uid

    await Like.dislike(targetID, type, uid)
    throw new global.errs.Success() 
})
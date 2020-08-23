const Router = require('koa-router')

const {CommentValidator, StringIdValidator} = require('@validator')
const {Comment} = require('@models/comment')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/comment'
})

router.post('/add', new Auth().user, async (ctx) => {
    const t1 = Date.now()
    const v = await new CommentValidator().validate(ctx)

    const { targetId, content, type } = v.get('body')
    const uid = ctx.auth.uid
    // 如果是回复别人
    const { commentId, replyUserId } = v.get('body')

    Comment.addComment(targetId, content, uid, commentId, replyUserId, type)
    throw new global.errs.Success() 
})

router.post('/delete', new Auth().user, async (ctx) => {
    const v = await new StringIdValidator().validate(ctx)

    const uniqueId = v.get('body.uniqueId')
    const uid = ctx.auth.uid
    const userType = ctx.auth.userType

    await Comment.deleteComment(uniqueId, uid, userType)
    throw new global.errs.Success() 
})

router.get('/getComment', async (ctx) => {
    const targetId = ctx.request.query.targetId
    if (!targetId) {
        throw new global.errs.ParameterException()
    }
    const data = await Comment.getComment(targetId)
    
    throw new global.errs.Success(data) 
})

module.exports = router
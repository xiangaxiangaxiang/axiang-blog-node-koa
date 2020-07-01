const Router = require('koa-router')

const {CommentValidator, IdValidator} = require('@validator')
const {Comment} = require('@models/comment')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/comment'
})

router.post('/add', new Auth().user, async (ctx) => {
    const v = await new CommentValidator().validate(ctx)
    const targetId = v.get('body.targetId')
    const content = v.get('body.content')
    const targetTitle = v.get('body.targetTitle')
    const uid = ctx.auth.uid
    // 如果是回复别人
    const commentId = v.get('body.commentId')
    const replyUserId = v.get('body.replyUserId')

    await Comment.addComment(targetId, content, uid, commentId, replyUserId, targetTitle)
    throw new global.errs.Success() 
})

router.post('/delete', new Auth().user, async (ctx) => {
    const v = await new IdValidator().validate(ctx)
    const id = v.get('body.id')
    const uid = ctx.auth.uid
    const userType = ctx.auth.userType
    
    if (!id) {
        throw new global.errs.ParameterException()
    }

    await Comment.deleteComment(id, uid, userType)
    throw new global.errs.Success() 
})

router.get('/getComment', async (ctx) => {
    const targetId = ctx.request.query.targetId
    if (!targetId) {
        throw new global.errs.ParameterException()
    }
    const data = await new Comment().getComment(targetId)
    ctx.body = data
})

module.exports = router
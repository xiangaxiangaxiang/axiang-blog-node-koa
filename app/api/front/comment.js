const Router = require('koa-router')

const {CommentValidator, StringIdValidator, GetCommentValidator} = require('@validator')
const {Comment} = require('@models/comment')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/comment'
})

router.post('/add', new Auth().user, async (ctx) => {
    const v = await new CommentValidator().validate(ctx)

    const { targetId, content, type } = v.get('body')
    const uid = ctx.auth.uid
    console.log(uid)
    // 如果是回复别人
    const { commentId, replyUserId } = v.get('body')

    const comment = await Comment.addComment(targetId, content, uid, commentId, replyUserId, type)
    throw new global.errs.Success(comment) 
})

router.post('/delete', new Auth().user, async (ctx) => {
    const v = await new StringIdValidator().validate(ctx)

    const uniqueId = v.get('body.uniqueId')
    const uid = ctx.auth.uid
    const userType = ctx.auth.userType

    await Comment.deleteComment(uniqueId, uid, userType)
    throw new global.errs.Success() 
})

router.get('/getComment', new Auth().tourist, async (ctx) => {
    const v = await new GetCommentValidator().validate(ctx)
    const { targetId, offset, limit } = v.get('query')
    
    const uid = ctx.auth.uid
    const data = await Comment.getComment(targetId, uid, offset, limit)
    
    throw new global.errs.Success(data) 
})

module.exports = router
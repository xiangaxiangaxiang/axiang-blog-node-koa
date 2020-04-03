const Router = require('koa-router')

const {LikeValidator} = require('@validator')
const {Comment} = require('@models/comment')

const router = new Router({
    prefix: '/front/comment'
})

router.post('/add', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetID = v.get('body.targetID')
    const content = v.get('body.content')
    const uid = ctx.auth.uid
    // 如果是回复别人
    const commentID = v.get('body.commentID')
    const replyUserID = v.get('body.replyUserID')

    await Comment.addComment(targetID, content, uid, commentID, replyUserID)
    throw new global.errs.Success() 
})

router.post('/delete', new Auth().user, async (ctx) => {
    const v = await new LikeValidator().validate(ctx)
    const targetID = v.get('body.targetID')
    const type = v.get('body.type')
    const uid = ctx.auth.uid

    await Like.dislike(targetID, type, uid)
    throw new global.errs.Success() 
})
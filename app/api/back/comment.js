const Router = require('koa-router')
const xss = require('xss')

const {Auth} = require('@middlewares/auth')
const { Comment } = require('@models/comment')
const {
    PaginationsValidator,
    IdValidator
} = require('@validator')

const router = new Router({
    prefix: '/back/comment'
})

router.get('/', new Auth().admin, async ctx => {
    const v = await new PaginationsValidator().validate(ctx)

    const offset = v.get('query.offset')
    const limit = v.get('query.limit')
    const searchText = v.get('query.searchText')

    const res = await Comment.getCommentList(offset, limit, searchText)

    throw new global.errs.Success(res)
})

router.post('/delete', new Auth().admin, async (ctx) => {
    const v = await new IdValidator().validate(ctx)
    const id = v.get('body.id')
    if (!id) {
        throw new global.errs.ParameterException()
    }
    const uid = ctx.auth.uid
    const userType = ctx.auth.userType
    await Comment.deleteComment(id, uid, userType)
    throw new global.errs.Success()
})

module.exports = router
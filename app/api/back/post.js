const Router = require('koa-router')

const {PostValidator} = require('@validator')

const {Post} = require('@models/post')

const router = new Router({
    prefix: '/back/post'
})

router.post('/add', new Auth().admin, async (ctx) => {
    const v = await new PostValidator().validate(ctx)
})

module.exports = router
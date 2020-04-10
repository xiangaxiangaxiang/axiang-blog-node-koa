const Router = require('koa-router')

const {
    AddArticleValidator,
    ModifyArticleValidator
} = require('@validator')

const {Post} = require('@models/post')

const router = new Router({
    prefix: '/back/article'
})

module.exports = router
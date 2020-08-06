const Router = require('koa-router')

const { Article } = require('@models/article')
const { PaginationsValidator } = require('@validator')

const router = new Router({
    prefix: '/front/article'
})

router.get('/list', async ctx => {

})

router.get('/detail', async ctx => {
    
})

module.exports = router
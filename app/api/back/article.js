const Router = require('koa-router')
const xss = require('xss')

const {upload} = require('../../lib/upload')
const {Auth} = require('@middlewares/auth')
const {
    AddArticleValidator，
    ModifyArticleValidator
} = require('@validator')
const {Article} = require('@models/article')

const router = new Router({
    prefix: '/back/article'
})

router.post('/image_upload', new Auth().admin, async (ctx) => {
    const files = ctx.request.files
    let urlList = []
    let saveList = []
    // 保存图片并返回对应的URL
    for (let file in files) {
        let savePath = `/img/article/${Date.now().toString()}_${files[file].name}`
        let item = [parseInt(file), savePath]
        urlList.push(item)
        let pathItem = {
            filePath: files[file].path,
            savePath
        }
        saveList.push(pathItem)
    }
    upload(saveList)
    ctx.body = {
        status: 0,
        data: urlList
    }
})

router.post('/add', new Auth().admin,async (ctx) => {
    const v = await new AddArticleValidator().validate(ctx)

    // 获取参数
    const title = v.get('body.title')
    const labels = v.get('body.labels')
    const articleType = v.get('body.articleType')
    let content = v.get('body.content')

    const article = {
        title,
        labels,
        articleType,
        content: xss(content)
    }

    const result = await Article.create(article)
    ctx.body = {
        result
    }
})

router.post('/modify', new Auth().admin, async (ctx) => {
    const v = await new ModifyArticleValidator().validate(ctx)

    // 获取参数
    const id = v.get('body.id')
    const title = v.get('body.title')
    const labels = v.get('body.labels')
    const articleType = v.get('body.articleType')
    let content = v.get('body.content')

    const article = {
        title,
        labels,
        articleType,
        content: xss(content)
    }

    await Article.updateArticle(id, article)
    throw new global.errs.Success()
})

router.post('/delete', new Auth().admin,async (ctx) => {
    const id = ctx.body.id
    if (!id) {
        throw new global.errs.ParameterException()
    }
    Article.deleteArticle(id)
    throw new global.errs.Success()
})

module.exports = router
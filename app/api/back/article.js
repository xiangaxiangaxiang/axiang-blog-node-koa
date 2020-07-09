const Router = require('koa-router')
const xss = require('xss')

const {upload} = require('../../lib/upload')
const {Auth} = require('@middlewares/auth')
const {
    UpsertArticleValidator,
    ModifyArticleValidator,
    PaginationsValidator,
    ArticlePublishValidator
} = require('@validator')
const {Article} = require('@models/article')

const router = new Router({
    prefix: '/back/article'
})

router.get('/', new Auth().admin, async ctx => {
    const v = await new PaginationsValidator().validate(ctx)

    const offset = v.get('query.offset')
    const limit = v.get('query.limit')
    const searchText = v.get('query.searchText')
    const label = v.get('query.label')

    const res = await Article.getArticles(offset, limit, searchText, label)

    throw new global.errs.Success(res)
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
    throw new global.errs.Success(urlList)

})

router.post('/upsert', new Auth().admin, async (ctx) => {
    const v = await new UpsertArticleValidator().validate(ctx)

    // 获取参数
    const title = v.get('body.title')
    const labels = v.get('body.labels')
    const articleType = v.get('body.articleType')
    const html = v.get('body.html')
    const markdown = v.get('body.markdown')
    const content = v.get('body.content')
    const publish = v.get('body.publish')
    const id = v.get('body.id')
    const firstImage = v.get('body.firstImage')

    const article = {
        title,
        labels,
        articleType,
        markdown,
        publish,
        content,
        firstImage,
        html: xss(html)
    }

    await Article.upsertArticle(id, article)
    throw new global.errs.Success()
})

router.post('/publish', new Auth().admin, async ctx => {
    const v = await new ArticlePublishValidator().validate(ctx)

    const id = v.get('body.id')
    const publish = v.get('body.publish')

    await Article.changePublish(id, publish)
    throw new global.errs.Success()
})

// router.post('/modify', new Auth().admin, async (ctx) => {
//     const v = await new ModifyArticleValidator().validate(ctx)

//     // 获取参数
//     const id = v.get('body.id')
//     const title = v.get('body.title')
//     const labels = v.get('body.labels')
//     const articleType = v.get('body.articleType')
//     let content = v.get('body.content')

//     const article = {
//         title,
//         labels,
//         articleType,
//         content: xss(content)
//     }

//     await Article.updateArticle(id, article)
//     throw new global.errs.Success()
// })

router.post('/delete', new Auth().admin,async (ctx) => {
    const id = ctx.request.body.id
    if (!id) {
        throw new global.errs.ParameterException()
    }
    Article.deleteArticle(id)
    throw new global.errs.Success()
})

module.exports = router
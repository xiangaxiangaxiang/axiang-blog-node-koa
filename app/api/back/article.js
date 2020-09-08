const Router = require('koa-router')
const { myXss } = require('../../lib/xss')

const { upload } = require('../../lib/upload')
const { Auth } = require('@middlewares/auth')
const {
    UpsertArticleValidator,
    PaginationsValidator,
    ArticlePublishValidator
} = require('@validator')
const { Article } = require('@models/article')
const { getArticleId } = require('../../lib/util')

const router = new Router({
    prefix: '/back/article'
})

router.get('/', new Auth().admin, async ctx => {
    const v = await new PaginationsValidator().validate(ctx)

    const {
        offset,
        limit,
        searchText,
        label
    } = v.get('query')

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
    upload(saveList, '/img/article')
    throw new global.errs.Success(urlList)

})

router.post('/upsert', new Auth().admin, async (ctx) => {
    const v = await new UpsertArticleValidator().validate(ctx)

    const {
        title,
        labels,
        articleType,
        html,
        markdown,
        content,
        publish,
        articleId,
        firstImage
    } = v.get('body')


    const article = {
        title,
        labels,
        articleType,
        markdown,
        publish,
        content,
        firstImage,
        html: myXss.process(html)
    }

    if (!articleId) {
        article.articleId = getArticleId(articleType)
    }

    await Article.upsertArticle(articleId, article)
    throw new global.errs.Success()
})

router.post('/publish', new Auth().admin, async ctx => {
    const v = await new ArticlePublishValidator().validate(ctx)

    const { articleId, publish } = v.get('body')

    await Article.changePublish(articleId, publish)
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

router.post('/delete', new Auth().admin, async (ctx) => {
    const articleId = ctx.request.body.articleId
    if (!articleId) {
        throw new global.errs.ParameterException()
    }
    Article.deleteArticle(articleId)
    throw new global.errs.Success()
})

module.exports = router
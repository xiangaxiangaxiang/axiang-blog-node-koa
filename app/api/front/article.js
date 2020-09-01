const Router = require('koa-router')

const { Article } = require('@models/article')
const { Like } = require('@models/like')
const { ArticleListValidator, TypeValidator, ArticleIdValidator } = require('@validator')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/article'
})

router.get('/recommendation', async ctx => {
    const labels = ctx.request.query.labels
    let res = []
    if (labels && Array.isArray(JSON.parse(labels))) {
        res = await Article.getRecommendation(JSON.parse(labels))
    }
    throw new global.errs.Success(res)
})

router.get('/list', async ctx => {
    const v = await new ArticleListValidator().validate(ctx)

    const {
        offset,
        limit,
        label,
        searchText,
        articleType
    } = v.get('query')

    const res = await Article.getArticles(offset, limit, searchText, label, articleType)

    res.articles = res.articles.map(item => {
        return {
            articleId: item.articleId,
            title: item.title,
            articleType: item.articleType,
            content: item.content,
            likeNums: item.likeNums,
            clickNums: item.clickNums,
            commentsNums: item.commentsNums,
            firstImage: item.firstImage
        }
    })

    throw new global.errs.Success(res)
})

router.get('/detail', new Auth().tourist, async ctx => {
    const v = await new ArticleIdValidator().validate(ctx)
    const uid = ctx.auth.uid

    const articleId = v.get('query.articleId')
    const res = await Article.getArticleDetail(articleId)
    let likeStatus = false
    if (uid) {
        likeStatus = await Like.getLikeStatus(uid, articleId)
    }
    res.likeStatus = likeStatus

    throw new global.errs.Success(res)
})

router.get('/label', async ctx => {
    const v = await new TypeValidator().validate(ctx)

    const type = v.get('query.type')

    const res = await Article.getLabel(type)
    throw new global.errs.Success(res)
})

router.get('/about', async ctx => {
    const about = await Article.findOne({
        where: {
            articleType: 400,
            publish: 1
        },
        order: [['updated_at', 'DESC']]
    })
    let html = about ? about.html : ''
    throw new global.errs.Success(html)
})

module.exports = router
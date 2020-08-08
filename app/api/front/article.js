const Router = require('koa-router')

const { Article } = require('@models/article')
const { Comment } = require('@models/comment')
const { ArticleListValidator } = require('@validator')

const router = new Router({
    prefix: '/front/article'
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

    console.log()

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

router.get('/detail', async ctx => {
    
})

module.exports = router
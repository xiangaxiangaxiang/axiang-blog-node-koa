const Router = require('koa-router')

const {PostValidator, IdValidator} = require('@validator')
const {Post} = require('@models/post')
const {upload} = require('../../lib/upload')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/back/post'
})

router.post('/add', new Auth().admin, async (ctx) => {
    const v = await new PostValidator().validate(ctx)

    const { content, type } = v.get('body')
    const files = v.get('files')

    let urls = []
    let saveList = []
    // 保存图片并返回对应的URL
    for (let file in files) {
        let savePath = `/img/post/${Date.now().toString()}_${files[file].name}`
        urls.push(savePath)
        let pathItem = {
            filePath: files[file].path,
            savePath
        }
        saveList.push(pathItem)
    }
    upload(saveList, '/img/post')

    await Post.addPost(content, urls, type)
    throw new global.errs.Success()
})

router.post('/delete', new Auth().admin, async (ctx) => {
    const v = await new IdValidator().validate(ctx)

    const id = v.get('body.id')
    
    await Post.deletePost(id)
    throw new global.errs.Success()
})

module.exports = router
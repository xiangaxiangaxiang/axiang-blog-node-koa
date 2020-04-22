const Router = require('koa-router')

const {PostValidator} = require('@validator')
const {Post} = require('@models/post')
const {upload} = require('../../lib/upload')

const router = new Router({
    prefix: '/back/post'
})

router.post('/add', new Auth().admin, async (ctx) => {
    const v = await new PostValidator().validate(ctx)
    const files = v.get('files')
    const content = v.get('body.content')
    const type = v.get('body.type')

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
    upload(saveList)

    await Post.addPost(content, urls, type)
    throw new global.errs.Success()
})

module.exports = router
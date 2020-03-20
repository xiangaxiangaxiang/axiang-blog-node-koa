const Router = require('koa-router')
const {upload} = require('../../lib/upload')

const router = new Router({
    prefix: '/back/article'
})

router.post('/image_upload', async (ctx) => {
    files = ctx.request.files
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

module.exports = router
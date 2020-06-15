/*
 * @Author: 翔阿翔阿翔
 * @Date: 2020-06-13 14:13:37
 * @LastEditTime: 2020-06-13 19:39:14
 * @Description: 数据统计
 * @FilePath: \axiang-blog-vue-typescripte:\web\project\back_end\Axiang-blog-node-koa\app\api\back\statistics.js
 */
const Router = require('koa-router')

const { Statistics } = require('@models/statistics')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/back/statistics'
})

router.get('/get_total', async (ctx) => {
    const data = await Statistics.getTotal()
    throw new global.errs.Success(data)
})

router.get('/get_monthly_statistics', async (ctx) => {
    const data = await Statistics.getMonthlyStatistics()
    throw new global.errs.Success(data)
})

module.exports = router
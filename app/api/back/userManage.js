const Router = require('koa-router')

const {User} = require('@models/user')
const {IdValidator} = require('@validator')

const router = new Router({
    prefix: '/back/user'
})

// 获取用户列表

router.get('/', new Auth().admin, async (ctx) => {
    const v = await new PaginationsValidator().validate(ctx)
})

// 禁用用户
router.post('/disable', new Auth().admin, async (ctx) => {
    const v = await new IdValidator().validate(ctx)

    const id = v.get('body.id')

    await User.update({
        enable: 0
    }, {
        where: {
            id
        }
    })
    throw new global.errs.Success()
})

// 解封用户
router.post('/enable', new Auth().admin, async (ctx) => {
    const v = await new IdValidator().validate(ctx)

    const id = v.get('body.id')

    await User.update({
        enable: 1
    }, {
        where: {
            id
        }
    })
    throw new global.errs.Success()
})

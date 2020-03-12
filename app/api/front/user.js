const Router = require('koa-router')

const {User} = require('@models/user')
const {RegisterValidator} = require('@validator')

const router = new Router({
    prefix: '/front/user'
})

router.post('/test', async (ctx) => {
    const file = ctx.request.body.files
    console.log(`file is ${file}`)
})

router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)

    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname')
    }
    const r = User.create(user)
    success()
})

module.exports = router
const Router = require('koa-router')
const Client = require('ftp');
const fs = require('fs');

const {User} = require('@models/user')
const {RegisterValidator} = require('@validator')

const router = new Router({
    prefix: '/front/user'
})

const c = new Client();

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
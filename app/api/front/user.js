const Router = require('koa-router')
const Client = require('ftp');
const fs = require('fs');

const {User} = require('@models/user')
const {RegisterValidator} = require('@validator')

const router = new Router({
    prefix: '/front/user'
})

const c = new Client();

router.post('/test', async (ctx) => {
    const files = ctx.request.body.file
    let filesArr = Array.from(files)
    let file = filesArr[0]
    // console.log(`file is ${file[0]}`)
    c.connect({
        user: 'cpx',
        password: 'cpxlalala'
    })
    c.on('ready', function() {
        c.put(file, '1.png',function(err) {
            if (err) throw err;
            c.end();
        });
    });
    ctx.body = {
        status: 0,
        msg: 'success'
    }
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
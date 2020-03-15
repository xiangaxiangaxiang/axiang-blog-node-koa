const Router = require('koa-router')

const {User} = require('@models/user')
const {RegisterValidator} = require('@validator')
const {UserType} = require('../../lib/enum')
const {upload} = require('../../lib/upload')

const router = new Router({
    prefix: '/front/user'
})

router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    
    const file = v.get('files.file')
    let avatar_path

    if (file) {
        const suffix = file.name.split('.').reverse()[0]
        avatar_path = `/img/avatar/avatar_${v.get('body.account')}.${suffix}`
        const file_path = file.path
        
        // 上传文件到ftp服务器
        upload(file_path, avatar_path)
    } else {
        // 如果用户没有上传头像则随机分配一个头像
        avatar_path = `/img/avatar/default_${ Math.floor(Math.random() * 5) + 1 }.jpg`
    }

    const user = {
        account: v.get('body.account'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname'),
        user_type: UserType.USER,
        avatar: avatar_path
    }
    const result = await User.create(user)
    throw new global.errs.Success()
})

module.exports = router
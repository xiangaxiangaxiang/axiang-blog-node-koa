const Router = require('koa-router')
const {unset} = require('lodash')

const {
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator,
    UpdateUserValidator
} = require('@validator')

const {User} = require('@models/user')
const {UserType} = require('../../lib/enum')
const {upload} = require('../../lib/upload')
const {generateToken} = require('@core/util')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/user'
})

// 修改用户信息
router.post('/update', new Auth().user, async (ctx) => {
    const v = await new UpdateUserValidator().validate(ctx)

    const id = v.get('body.id')
    const nickname = v.get('body.nickname')
    const password = v.get('body.password2')
    // 修改用户头像
    const file = v.get('files.file')
    let avatar_path
    if (file) {
        // 获取文件后缀
        const suffix = file.name.split('.').reverse()[0]

        avatar_path = `/img/avatar/avatar_${v.get('body.account')}.${suffix}`
        
        // 上传文件到ftp服务器
        upload(file.path, avatar_path)
    }

    const result = await User.updateUser(id, nickname, password, avatar_path)
    throw new global.errs.Success()

})

// 登录
router.post('/login', async (ctx) => {
    const v = await new LoginValidator().validate(ctx)
    const account = v.get('body.account')
    const password = v.get('body.password')
    // 验证密码,用户状态
    const user = await User.verifyAccount(account, password)
    const token = generateToken(user.id, user.user_type)
    user.setDataValue('token', token)
    ctx.body = {
        token,
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar
    }
})

// 测试验证token
router.get('/verify', new Auth().admin,async (ctx) => {
    // const v = await new NotEmptyValidator().validate(ctx)
    // const result =  Auth.verifyToken(v.get('query.token'))
    ctx.body = {
        result: 'pass'
    }
})

// 普通用户注册
router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    
    const file = v.get('files.file')
    let avatar_path

    if (file) {
        // 获取文件后缀
        const suffix = file.name.split('.').reverse()[0]

        avatar_path = `/img/avatar/avatar_${v.get('body.account')}.${suffix}`
        
        // 上传文件到ftp服务器
        upload(file.path, avatar_path)
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
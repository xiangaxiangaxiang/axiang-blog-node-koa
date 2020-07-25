const Router = require('koa-router')
const {unset} = require('lodash')

const {
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator,
    UpdateUserValidator,
    UpdatePasswordValidator
} = require('@validator')

const {User} = require('@models/user')
const { Statistics } = require('@models/statistics')
const {UserType} = require('../../lib/enum')
const {upload} = require('../../lib/upload')
const {generateToken} = require('@core/util')
const {generateUid} = require('../../lib/util')
const {Auth} = require('@middlewares/auth')

const router = new Router({
    prefix: '/front/user'
})

router.get('/tourist', new Auth().tourist, async (ctx) => {
    await Statistics.addWebHits()
    const newUser = {
        account: `tourist${Date.now()}`,
        password: 'tourist',
        nickname: `游客-${Date.now()}`,
        userType: UserType.TOURIST,
        avatar: `/img/avatar/default_${ Math.floor(Math.random() * 5) + 1 }.jpg`
    }
    if (ctx.tourist && (ctx.tourist.newTourist || ctx.tourist.expires)) {
        const user = await User.createUser(newUser)
        const token = generateTouristToken(user.uid, UserType.TOURIST)
        ctx.cookies.set('auth', token, {
            maxAge: 3 * 60 * 1000
        })
    }
})

router.post('/password', async (ctx) => {
    const v = await new UpdatePasswordValidator().validate(ctx)
    const uid = v.get('body.uid')
    const oldPassword = v.get('body.oldPassword')
    const newPassword = v.get('body.password2')

    await User.updatePassword(uid, oldPassword, newPassword)
    throw new global.errs.Success()
})

// 修改用户信息
router.post('/update', new Auth().user, async (ctx) => {
    const v = await new UpdateUserValidator().validate(ctx)

    const uid = v.get('body.uid')
    const nickname = v.get('body.nickname')
    // 修改用户头像
    const file = v.get('files.file')
    let avatarPath
    if (file) {
        // 获取文件后缀
        const suffix = file.name.split('.').pop()

        avatarPath = `/img/avatar/avatar_${v.get('body.account')}.${suffix}`
        
        // 上传文件到ftp服务器
        let filelist = [{
            filePath: file.path,
            avatarPath
        }]
        upload(filelist)
    }

    const user = await User.updateUser(uid, nickname, avatarPath)
    throw new global.errs.Success(user)

})

// 登录
router.post('/login', async (ctx) => {
    const v = await new LoginValidator().validate(ctx)
    const account = v.get('body.account')
    const password = v.get('body.password')
    // 验证密码,用户状态
    const user = await User.verifyAccount(account, password)
    // 生成token
    const token = generateToken(user.uid, user.userType)
    ctx.cookies.set('auth', token, {
        maxAge: 24 * 60 * 1000
    })
    const res = {
        uid: user.uid,
        nickname: user.nickname,
        avatar: user.avatar,
        token
    }
    throw new global.errs.Success(res)
})

// 测试验证token
router.get('/verify', new Auth().admin, async (ctx) => {
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
    let avatarPath

    if (file) {
        // 获取文件后缀
        const suffix = file.name.split('.').reverse()[0]

        avatarPath = `/img/avatar/avatar_${v.get('body.account')}.${suffix}`
        
        // 上传文件到ftp服务器
        let filelist = [{
            filePath: file.path,
            avatarPath
        }]
        upload(filelist)
    } else {
        // 如果用户没有上传头像则随机分配一个头像
        avatarPath = `/img/avatar/default_${ Math.floor(Math.random() * 5) + 1 }.jpg`
    }

    const user = {
        account: v.get('body.account'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname'),
        userType: UserType.USER,
        avatar: avatarPath,
        uid: generateUid()
    }
    await User.createUser(user)
    throw new global.errs.Success()
})

module.exports = router
const Router = require('koa-router')

const { User } = require('@models/user')
const {
    IdValidator,
    PaginationsValidator,
    AdminRegisterValidator
} = require('@validator')
const {Auth} = require('@middlewares/auth')
const {upload} = require('../../lib/upload')
const {generateToken} = require('@core/util')

const router = new Router({
    prefix: '/back/user'
})

// 管理员登陆
router.post('/admin_login', async (ctx) => {
    const v = await new LoginValidator().validate(ctx)
    const account = v.get('body.account')
    const password = v.get('body.password')
    // 验证密码,用户状态
    const user = await User.verifyAdmin(account, password)
    // 生成token
    const token = generateToken(user.id, user.userType)
    user.setDataValue('token', token)
    ctx.body = {
        token,
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar
    }
})

// 管理员注册
router.post('/admin_register', async (ctx) => {
    const v = await new AdminRegisterValidator().validate(ctx)

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
        userType: UserType.ADMIN,
        avatar: avatarPath
    }
    const result = await User.create(user)
    throw new global.errs.Success()
})

// 获取用户列表

router.get('/', new Auth().admin, async (ctx) => {
    const v = await new PaginationsValidator().validate(ctx)
    const offset = v.get('body.offset')
    const limit = v.get('body.limit')
    const sort = v.get('body.sort')
    const order = v.get('body.order')
    let users
    if (sort && order) {
        users = await User.getUserList(offset, limit, sort, order)
    } else {
        users = await User.getUserList(offset, limit)
    }
    ctx.body = {
        data: users,
        total: users.length
    }
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

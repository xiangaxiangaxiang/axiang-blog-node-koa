const baseStaticPath = process.env.NODE_ENV === 'production' ?
    '服务器路径' :
    '本地路径'

// 全局配置，clone下来之后需要自行修改文件名 config1.js 为 config.js
module.exports = {
    environment: 'dev',
    database: {
        dbName: 'axiangblog',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password'
    },
    security: {
        secretKey: 'secretKey',
        expiresIn: 60*60*24,
        touristExpiryIn: 60*60*3
    },
    // ftp: {
    //     host: 'localhost',
    //     port: 21,
    //     user: 'user',
    //     password: 'password'
    // },
    adminSecret: 'adminSecret'
}

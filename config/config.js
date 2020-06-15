module.exports = {
    environment: 'dev',
    database: {
        dbName: 'axiangblog',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'xxx,./123'
    },
    security: {
        secretKey: 'lalalalalaldemaxiya',
        expiresIn: 60*60*24,
        touristExpiryIn: 60*60*3
    },
    ftp: {
        host: 'localhost',
        port: 21,
        user: 'cpx',
        password: 'cpxlalala'
    },
    adminSecret: 'demaxiyawansui'
}
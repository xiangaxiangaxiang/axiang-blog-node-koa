// 生成一个随机不重复的字符串
function randomStr() {
    let num = Date.now() * 1534
    return num.toString(16)
}

module.exports = {
    randomStr
}
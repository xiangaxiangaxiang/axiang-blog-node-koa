function getArticleId(type) {
    let articleMap = new Map()
    articleMap.set(100, 'te')
    articleMap.set(200, 'lv')
    articleMap.set(300, 'dr')
    return articleMap.get(type) + Date.now().toString(16)
}

function generateUid() {
    let time = Date.now().toString().substring(1,11) * 3
    return time.toString(16)
}

module.exports = {
    getArticleId,
    generateUid
}
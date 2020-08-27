
const {PostType, OperationType} = require('../lib/enum')

class Operation {
    static async getData(targetId, type) {
        const {Article} = require('./article')
        const {Post} = require('./post')
        const {Comment} = require('./comment')
        type = parseInt(type)
        if (!OperationType.isThisType(type)) {
            throw new global.errs.ParameterException()
        }
        let data
        if (type === OperationType.ARTICLE) {
            data = await Article.findOne({
                where: {
                    articleId: targetId
                }
            })
        } else if (type === OperationType.POST) {
            data = await Post.findOne({
                where: {
                    postId: targetId
                }
            })
        } else if (type === OperationType.COMMENT) {
            data = await Comment.findOne({
                where: {
                    uniqueId: targetId
                }
            })
        } else {
            throw new global.errs.NotFound('对象已被删除')
        }
        return data
    }

    static async getAllData(targetIds, type) {
        const {Article} = require('./article')
        const {Post} = require('./post')
        const {Comment} = require('./comment')
        type = parseInt(type)
        if (!OperationType.isThisType(type)) {
            throw new global.errs.ParameterException()
        }
        let data = []
        if (type === OperationType.ARTICLE) {
            data = await Article.findAll({
                where: {
                    articleId: targetIds
                }
            })
        } else if (type === OperationType.POST) {
            data = await Post.findAll({
                where: {
                    postId: targetIds
                }
            })
        } else if (type === OperationType.COMMENT) {
            data = await Comment.findAll({
                where: {
                    uniqueId: targetIds
                }
            })
        }
        return data
    }
}

module.exports = {
    Operation
}

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
                    id: targetId
                }
            })
        } else if (type === OperationType.POST) {
            data = await Post.findOne({
                where: {
                    id: targetId
                }
            })
        } else if (type === OperationType.COMMENT) {
            data = await Comment.findOne({
                where: {
                    id: targetId
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
                    id: targetIds
                }
            })
        } else if (type === OperationType.POST) {
            data = await Post.findAll({
                where: {
                    id: targetIds
                }
            })
        } else if (type === OperationType.COMMENT) {
            data = await Comment.findAll({
                where: {
                    id: targetIds
                }
            })
        }
        return data
    }
}

module.exports = {
    Operation
}
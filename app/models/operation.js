const {Article} = require('./article')
const {Post} = require('./post')
const {Comment} = require('./comment')
const {PostType, OperationType} = require('../lib/enum')

class Operation {
    static async getData(targetId, type) {
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
}

module.exports = {
    Operation
}
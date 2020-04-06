const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')
const {Operation} = require('./operation')

class Like extends Model {
    
    static async like(targetId, type, uid) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
                type,
                uid
            }
        })
        if (likeItem) {
            throw new global.errs.LikeError()
        }
        return sequelize.transaction(async t => {
            await Like.create({
                targetId,
                type,
                uid
            }, {transaction: t})
            const data = await Operation.getData(targetId, type)
            await art.increment('likeNums', {
                by: 1,
                transaction: t
            })
        })
    }

    static async dislike(targetId, type, uid) {
        const likeItem = await Like.findOne({
            where: {
                targetId,
                type,
                uid
            }
        })
        if (!likeItem) {
            throw new global.errs.DislikeError()
        }
        
        return sequelize.transaction(async t => {
            await likeItem.destroy({
                force: true,
                transaction: t
            })
            const data = await Operation.getData(targetId, type)
            await art.decrement('likeNums', {
                by: 1,
                transaction: t
            })
        })
    }
}

Like.init({
    uid: Sequelize.INTEGER,
    targetId: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'like'
})

module.exports = {
    Like
}
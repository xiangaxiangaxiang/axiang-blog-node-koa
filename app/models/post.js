const {Sequelize, Model} = require('sequelize')
const { sequelize } = require('../../core/db')

class Post extends Model {
    static async addPost(content, urls, type) {
        const data = {
            content,
            urls,
            type
        }
        await Post.create(data)
    }

    static async deletePost(id) {
        const post = await Post.findOne({
            where: {
                id
            }
        })
        if (!post) {
            throw new global.errs.NotFound('找不到该动态')
        }
        await post.destroy()
    }
}

Post.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: Sequelize.STRING,
    urls: Sequelize.STRING,
    type: Sequelize.INTEGER,
    likeNums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'post'
})

module.exports = {Post}
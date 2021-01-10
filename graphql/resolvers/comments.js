const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
    Mutation: {
        async createComment(parents, args, context, info){
            let {postId, body} = args;
            const user = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError("Comment contains no text",
                {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                });
            }

            const post = await Post.findById(postId);
            if(post){
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError("Post not found");
        },
        async deleteComment(parents, args, context, info){
            let {postId, commentId} = args;
            const user = checkAuth(context);
            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex(elem => elem.id === commentId);

                if(post.comments[commentIndex].username === user.username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError("Post not found")
            }
        }
    }
}
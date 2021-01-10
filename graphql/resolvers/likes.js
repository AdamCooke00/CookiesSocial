const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
    Mutation: {
        async likePost(parents, args, context, info){
            const user = checkAuth(context);
            let {postId} = args;

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === user.username)){
                    post.likes = post.likes.filter(like => like.username !== user.username);
                } else {
                    post.likes.unshift({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;

            } else throw new UserInputError("Post not found");
        }
    }
}
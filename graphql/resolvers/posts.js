const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1});
                return posts;
            } catch (e) {
                throw new Error(e);
            }
        },
        async getPost(parent, args, context, info){
            const {postId} = args;
            try{
                const post = await Post.findById(postId)
                if(post){
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (e){
                throw new Error(e);
            }
        }
    },
    Mutation: {
        async createPost(parent, args, context, info){
            const user = checkAuth(context);
            console.log(user);
            let {title, body} = args;
            if(body.trim() === ''){
                throw new UserInputError("Post body cannot be empty")
            }
            const post = new Post({
                title,
                body,
                createdAt: new Date().toISOString(),
                user: user.id,
                username: user.username
            });
            const newPost = await post.save();
            return newPost;
        },
        async deletePost(parent, args, context, info){
            const user = checkAuth(context);
            const {postId} = args;
            try{
                const post = await Post.findById(postId);
                if(post){
                    if(user.username === post.username){
                        await Post.deleteOne();
                        return "Post has been deleted";
                    }
                    throw new AuthenticationError("You can't delete a post that is not yours");
                }
                throw new Error("Post does not exist");
            } catch (e){
                throw new Error(e);
            }
            
        }
    }
}
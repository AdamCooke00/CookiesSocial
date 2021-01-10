const {gql} = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!,
        title: String!,
        body: String!,
        createdAt: String!,
        username: String!,
        comments: [Comment]!,
        likes: [Like]!
    }

    type Comment{
        id: ID!,
        createdAt: String!,
        username: String!,
        body: String!
    }

    type Like{
        id: ID!,
        createdAt: String!,
        username: String!
    }

    type User{
        id: ID!,
        token: ID!,
        createdAt: String!,
        username: String!,
        email: String!,
    }

    input RegisterInput{
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!,
    } 

    type Query{
        getPosts: [Post],
        getPost(postId: ID!): Post
    }

    type Mutation{
        register(registerInput: RegisterInput): User!,
        login(username: String!, password: String!): User!,
        createPost(title: String!, body: String!): Post!,
        deletePost(postId: ID!): String!,
        createComment(postId: ID!, body: String!): Post!,
        deleteComment(postId: ID!, commentId: ID!): Post!,
        likePost(postId: ID!): Post!
    }
`
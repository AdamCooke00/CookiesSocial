const {ApolloServer, gql} = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index")
const {MONGODB} = require("./config");


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB");
        return server.listen({port: 5000})
    })
    .then(({url}) => {
        console.log(`🚀 Server ready at ${url}`);
    }
);
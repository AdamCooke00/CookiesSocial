import React from 'react';
import App from "./App";
import {ApolloClient, InMemoryCache, createHttpLink, ApolloProvider} from "@apollo/client";
import {setContext} from "apollo-link-context"

const httpLink = createHttpLink({
    uri: "http://localhost:5000"
});

const authLink = setContext(()=>{
    const token = localStorage.getItem("Token")
    console.log(token)
    return{
        headers:{
            Authorization: token ? `Bearer ${token}` : ""
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default function ApolloWrapper(){
    return(
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    )
};


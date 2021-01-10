import React, {useContext} from 'react';
import {useQuery} from "@apollo/client";
import gql from "graphql-tag";
// import '../App.css';

import {AuthContext} from '../context/auth'

import { Grid } from 'semantic-ui-react'
import PostCard from "../components/PostCard"
import PostForm from "../components/PostForm"



export default function Home(){

    const {user} = useContext(AuthContext);
    const { data, loading, error } = useQuery(FETCH_POSTS_QUERY);
    if(data) {
        var { getPosts: posts } = data;
    }
    if(error) {
        console.log(error);
        return "error"; // blocks rendering
    }
    return(
        <Grid columns={3}>
            <Grid.Row className="page-title">
            <h3>Recent Posts</h3>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>

                )}

                {loading ? (
                    <h1>Loading the posts...</h1>
                ) : 
                    posts &&
                        posts.map(post => (
                            <Grid.Column key={post.id} style={{marginBottom: 15}}>
                                <PostCard post={post}/>
                            </Grid.Column>
                        ))
                
                }      
            </Grid.Row>
        </Grid>
    )
};

const FETCH_POSTS_QUERY = gql`
{
    getPosts{
        id body createdAt username title 
        likes{
            username
        }
        comments{
            id username body createdAt
        }      
    }
}`
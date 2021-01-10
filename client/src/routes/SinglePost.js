import gql from 'graphql-tag';
import React, {useContext} from 'react';
import {useQuery} from '@apollo/client'
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react';
import moment from "moment"

import {AuthContext} from "../context/auth"
import LikeButton from '../components/LikeButton';
import DeleteButton from "../components/DeleteButton"

function SinglePost(props) {
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext); 
    const data = useQuery(FETCH_POST,{
        variables:{
            postId
        }
    })
    let postMarkup;
    console.log(data);
    if(!data.data.getPost){
        postMarkup = <p>Loading post...</p>
    } else{
        const {id, body , createdAt, username, comments, likes} = data.data.getPost;
        console.log(id);
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likes}}/>
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color="violet">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="violet" pointing="left">{comments.length}</Label>
                                </Button>
                                {user && user.username === username && <DeleteButton postId={postId}/>}

                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    return postMarkup;
}

const FETCH_POST = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username
            likes{
                username
            }
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost;
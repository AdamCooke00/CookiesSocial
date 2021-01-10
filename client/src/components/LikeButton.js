import React, {useEffect, useState} from 'react';
import {Button, Icon, Label} from "semantic-ui-react"
import {useMutation} from "@apollo/client"
import gql from 'graphql-tag';
import {Link} from "react-router-dom"


function LikeButton({user, post: {id, likes}}) {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST, {
        variables: { postId: id }
      });

    const likeButton = user ? (
    liked ? (
        <Button color="violet">
            <Icon name="heart" />
        </Button>
    ) : (
        <Button color="violet" basic>
            <Icon name="heart" />
        </Button>
    )
    ) : (
    <Button as={Link} to="/login" color="violet" basic>
        <Icon name="heart" />
    </Button>
    );

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label as='a' basic color='red' pointing='left'>
                {likes.length}
            </Label>
        </Button>
    );
}


const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
    }
  }
`;

export default LikeButton;
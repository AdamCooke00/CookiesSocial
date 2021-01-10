import React, {useContext} from 'react';
import {Card, Icon, Label, Button, Image} from "semantic-ui-react"
import moment from 'moment'
import {Link} from "react-router-dom"
import LikeButton from "./LikeButton.js"
import DeleteButton from "./DeleteButton"
import {AuthContext} from "../context/auth";

function PostCard(props) {
    const {body, createdAt, id, username, likes, comments} = props.post;
    const {user} = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{id, likes}}/>
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='blue' basic>
                        <Icon name='comments' />
                    </Button>
                    <Label as='a' basic color='blue' pointing='left'>
                        {comments.length}
                    </Label>
                </Button>
                {user && user.username === username && <DeleteButton postId={id}/>}
            </Card.Content>
        </Card>
    );
}

export default PostCard;
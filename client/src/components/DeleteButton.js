import gql from "graphql-tag"
import React, {useState} from 'react';
import {useMutation} from"@apollo/client"

import {Button, Icon, Confirm} from "semantic-ui-react"

function DeleteButton({postId}) {

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePost] = useMutation(DELETE_POST, {
        variables:{
            postId
        },
        update(){
            setConfirmOpen(false);
            
        }
    })

    return (
        <div>

        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
        <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePost}
            />
        </div>
    );
}

const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`


export default DeleteButton;
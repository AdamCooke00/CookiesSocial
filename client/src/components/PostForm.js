import React, {useState} from 'react';
import gql from "graphql-tag"
import {Button, Form} from "semantic-ui-react"
import {useMutation} from "@apollo/client"


function PostForm(props) {
    const [postValues, setPostValues] = useState({
        title: '',
        body: '',
    })
    const [errors, setErrors] = useState({hasError: false})

    const onChange = (event) =>{
        setPostValues({...postValues, [event.target.name]: event.target.value})
    };

    const onSubmit = (event) => {
        event.preventDefault();
        createPost();
    }

    const [createPost, {error}] = useMutation(CREATE_POST, {
        variables: postValues,
        update(proxy, result){
            console.log(error)
            const data = proxy.readQuery({
                query: gql`
                {
                  getPosts {
                    id
                    body
                    title
                    createdAt
                    username
                    likes {
                      username
                    }
                    comments {
                      id
                      username
                      createdAt
                      body
                    }
                  }
                }
              `
            });
            let newData = [...data.getPosts];
            newData = [result.data.createPost, ...newData]
            proxy.writeQuery({
                query: gql`
                {
                  getPosts {
                    id
                    body
                    title
                    createdAt
                    username
                    likes {
                      username
                    }
                    comments {
                      id
                      username
                      createdAt
                      body
                    }
                  }
                }
              `,
                data: {
                    ...data,
                    getPosts: {
                        newData
                    }
                }
            });
            setPostValues({title:"", body: ""})
            setErrors({hasError:false})
        },
        onError(e){
            setErrors({hasError: true, ...e.graphQLErrors[0].extensions.exception.errors})
        },
    });

    return (
        <Form onSubmit={onSubmit}>
            <h3>Create a post:</h3>
            <Form.Field>
                <Form.Input
                    placeholder="Post Title..."
                    name="title"
                    onChange={onChange}
                    value={postValues.title}
                    error={error ? true : false}
                    />
                <Form.Input
                    placeholder="Write your post here..."
                    name="body"
                    onChange={onChange}
                    value={postValues.body}
                    error={error ? true : false}
                    />
                    <Button type="submit" color="violet">
                        Submit Post 
                    </Button>
            </Form.Field>
            {console.log(errors.hasError)}
            {errors.hasError && (
                <p><strong>Unable to post. Please insure body is filled.</strong></p>
            )}
        </Form>
        
        
    );
}


const CREATE_POST = gql`
    mutation createPost(
        $title: String!
        $body: String!
    ){
        createPost(
            title: $title
            body: $body
        ){
            id
            title
            body
            createdAt
            username
            comments{
                id
                username
                body
                createdAt
            }
            likes{
                id
                username
                createdAt
            }
        }
    }
`;


export default PostForm;
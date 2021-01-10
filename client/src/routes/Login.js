import gql from 'graphql-tag';
import {useMutation} from "@apollo/client"
import React, {useContext, useState} from 'react';
import {Form, Button, Message} from "semantic-ui-react"
import { AuthContext } from '../context/auth';


export default function Login(props){
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({hasError: false})

    const [logValues, setLogValues] = useState({
        username: '',
        password: '',
    })

    const onChange = (event) =>{
        setLogValues({...logValues, [event.target.name]: event.target.value})
    };

    const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(proxy, result){
            console.log(result)
            context.login(result.data.login)
            props.history.push('/')
        },
        onError(e){
            console.log(e);
            setErrors({hasError: true, ...e.graphQLErrors[0].extensions.exception.errors})
        },
        variables: logValues
    });

    const onSubmit = (event) => {
        event.preventDefault();
        loginUser();
    }

    const getErrorOutput = (errors) => {
        let errorOutput = "";
        for(let key in errors) {
            if(key!=="hasError"){
                errorOutput+=`${errors[key]}. \n`;
            }
        }
        return errorOutput
    }

    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""} error>
                <Form.Input label='Username' type="text" placeholder="Username..." name="username" value={logValues.username} onChange={onChange}/>
                <Form.Input label='Password' type="password" placeholder="" name="password" value={logValues.password} onChange={onChange}/>
                {errors.hasError && 
                    <Message
                    error
                    header='Action Forbidden'
                    content={getErrorOutput(errors)}
                />}
                <Button type="submit" primary>Login</Button>
            </Form>
        </div>
    )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password 
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
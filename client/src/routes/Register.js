import gql from 'graphql-tag';
import {useMutation} from "@apollo/client"
import React, {useContext,useState} from 'react';
import {Form, Button, Message} from "semantic-ui-react"
import { AuthContext } from '../context/auth';



export default function Register(props){
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({hasError: false})

    const [regValues, setRegValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    })

    const onChange = (event) =>{
        setRegValues({...regValues, [event.target.name]: event.target.value})
    };

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(proxy, result){
            console.log(result)
            context.login(result.data.register)
            props.history.push('/')
        },
        onError(e){
            setErrors({hasError: true, ...e.graphQLErrors[0].extensions.exception.errors})
        },
        variables: regValues
    });

    const onSubmit = (event) => {
        event.preventDefault();
        addUser();
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
                <Form.Input label='Username' type="text" placeholder="Username..." name="username" value={regValues.username} onChange={onChange}/>
                <Form.Input label='Email' type="email" placeholder="you@gmail.com" name="email" value={regValues.email} onChange={onChange}/>
                <Form.Input label='Password' type="password" placeholder="" name="password" value={regValues.password} onChange={onChange}/>
                <Form.Input label='Confirm Password' type="password" placeholder="" name="confirmPassword" value={regValues.confirmPassword} onChange={onChange}/>
                {errors.hasError && 
                    <Message
                    error
                    header='Action Forbidden'
                    content={getErrorOutput(errors)}
                />}
                <Button type="submit" primary>Register</Button>
            </Form>
        </div>
    )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
  ) {
    register(
      registerInput: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
        email: $email
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
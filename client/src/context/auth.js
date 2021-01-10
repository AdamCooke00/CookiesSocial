import React, {useReducer, createContext} from 'react';
import jwtDecode from "jwt-decode"

const initialUserState = {
    user:null
}

if(localStorage.getItem("Token")){
    const decodedToken = jwtDecode(localStorage.getItem("Token"))
    if(decodedToken.exp*1000 < Date.now()){
        localStorage.removeItem("Token")
    } else {
        initialUserState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user:null,
    login: userData => {},
    loguout: () => {}
})

const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }
        default:
            return state
    }
}

const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialUserState);
    const login = userData => {
        localStorage.setItem("Token", userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }
    const logout = () => {
        localStorage.removeItem("Token")
        dispatch({type: 'LOGOUT'})
    }
    return (
        <AuthContext.Provider 
            value={{user: state.user, login, logout}}
            {...props}
        />
    )
}

export {AuthContext, AuthProvider}
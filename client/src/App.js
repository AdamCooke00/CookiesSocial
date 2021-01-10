import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import {Container} from "semantic-ui-react"

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import {AuthProvider} from "./context/auth"
import AuthRoute from './context/AuthRoute';

import Home from "./routes/Home";
import Register from "./routes/Register";
import Login from "./routes/Login";
import TabBar from "./components/TabBar"
import SinglePost from "./routes/SinglePost"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <TabBar/>
          <Route exact path='/' component={Home}/>
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost}/>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;

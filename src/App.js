import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';

import AuthRoute from './util/AuthRoute';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import CreatePost from './pages/CreatePost';
import Applicants from './pages/Applicants';
import Chat from './pages/Chat'

function App() {
  return (
    <AuthProvider>
      <Router>
      
          <Container>
            <MenuBar />
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/profile" component={Profile} />
            <AuthRoute exact path="/createpost" component={CreatePost} />
            
            <AuthRoute exact path="/chat" component={Chat}></AuthRoute>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/jobposts/:postId" component={SinglePost} />
            <AuthRoute exact path="/applicants/:postId" component={Applicants} />
          </Container>
       
      </Router>
    </AuthProvider>
  );
}


export default App;

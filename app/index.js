import React from 'react';
import { Router, Route, Link } from 'react-router';
import Onboarding from './components/Onboarding';
import Splash from './components/Splash';

import Login from './pages/Login';
import NeighborhoodCreation from './pages/NeighborhoodCreation';
import LoginSesion from './pages/LoginSesion';
import Neighbors from './pages/Neighbors';
import Profile from './pages/Profile';
import InviteNeighbors from './pages/InviteNeighbors';


export default class App extends React.Component {
  buttonClick(callback) {
    setTimeout(function(){callback();}, 2000);
  }

  render() {
    return(
      <div id="app">
        <div id="phoneBar"></div>
        <div id="content">
        
          <InviteNeighbors/>

          { /* <Onboarding/> */ }
        </div>
        { /* <Splash/> */ }
      </div>
    );
  }
}
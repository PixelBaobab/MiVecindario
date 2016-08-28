import React from 'react';
import { Router, Route, Link } from 'react-router';
import Onboarding from './components/Onboarding';
import Splash from './components/Splash';

import Login from './pages/Login';
import NeighborhoodCreation from './pages/NeighborhoodCreation';
import LoginSesion from './pages/LoginSesion';
import Neighbors from './pages/Neighbors';

export default class App extends React.Component {
  buttonClick(callback) {
    setTimeout(function(){callback();}, 2000);
  }

  render() {
    return(
      <div id="app">
        <div id="phoneBar"></div>
        <div id="content">
        
          <Neighbors/>

          { /* <Onboarding/> */ }
        </div>
        { /* <Splash/> */ }
      </div>
    );
  }
}
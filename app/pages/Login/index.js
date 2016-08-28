import React from 'react';

export default class Login extends React.Component {
  render() {
    return(
      <div>
     	  <h1 className="ui primary success header">Bienvenido a</h1>
      	<img id="logo-login" src="/img/logo-login.png" />
        <button className="ui orange button">Crear Vecindario</button>
        <h2>&oacute;</h2>
        <button className="ui orange button">Iniciar Sesi&oacute;n</button>
		  </div>
    );
  }
}
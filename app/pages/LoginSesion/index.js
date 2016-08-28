import React from 'react';

export default class LoginSesion extends React.Component {
  render() {
    return(
      <div>
     	  <button className="ui inverted orange button">Volver</button>
      	<img id="logo-crear-vecindario" src="/img/logo-crear-vecindario.png" />
        <h1>Iniciar Sesión</h1>
        <form className="ui form">
          <div className="field">
            <label>Teléfono o Email</label>
            <input type="text" name="neighborhood-name" placeholder="XXXX - XXXX" />
          </div>
          <div className="field">
            <label>Password</label>
            <input input type="password"/>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" tabindex="0" class="hidden" />
              <label>Recordarme</label>
            </div>
          </div>
          <button className="ui orange button" type="submit">Ingresar</button>
        </form>
		  </div>
    );
  }
}
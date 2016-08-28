import React from 'react';

export default class NeighborhoodCreation extends React.Component {
  render() {
    return(
      <div>
     	  <button className="ui inverted orange button">Volver</button>
      	<img id="logo-crear-vecindario" src="/img/logo-crear-vecindario.png" />
        <h1>Crear MiVecindario</h1>
        <form className="ui form">
          <div className="field">
            <label>Nombre del Vecindario</label>
            <input type="text" name="neighborhood-name" placeholder="Por ejemplo: Condominio Rosedal 1" />
          </div>
          <div className="field">
            <label>Nombre de Casa</label>
            <input type="text" name="house-name" placeholder="Por ejemplo: Familia Rodriguez" />
          </div>
          <div className="field">
            <label>Número de Teléfono o Email</label>
            <input type="text" name="house-name" placeholder="Por ejemplo: Familia Rodriguez" />
          </div>
          <div className="field">
            <label>Password</label>
            <input input type="password" />
          </div>
          <div className="field">
            <label>Confirme Password</label>
            <input input type="password" />
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input type="checkbox" tabindex="0" class="hidden" />
              <label>Estoy de acuerdo con los <a href="#">Términos y Condiciones</a></label>
            </div>
          </div>
          <button className="ui orange button" type="submit">Crear</button>
        </form>
		  </div>
    );
  }
}
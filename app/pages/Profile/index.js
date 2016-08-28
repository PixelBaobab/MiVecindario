import React from 'react';

export default class Profile extends React.Component {
  render() {
    return(
      <div>
     	  <h1>Perfil</h1>
        <hr />
        <p>Aquí puede editar su información de inicio de sesión. (Para cambio de número de teléfono o email se le enviará una confirmación).</p>
        <div>
        
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
            <label>Confirme Password</label>
            <input input type="password"/>
          </div>

          <button className="ui gray button">Cancelar</button>
          <button className="ui orange button">Guardar</button>
        </form>



          
        </div>

     

        <div>
        <button className="ui orange basic button"><img src="/img/tab-addvecino.png"/></button>
        <button className="ui orange basic button"><img src="/img/tab-vecinos.png"/></button>
        <button className="ui orange basic button"><img src="/img/tab-perfil.png"/></button>
        </div>

		  </div>
    );
  }
}
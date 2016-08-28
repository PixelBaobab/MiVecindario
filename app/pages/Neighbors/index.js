import React from 'react';

export default class Neighbors extends React.Component {
  render() {
    return(
      <div>
     	  <h1>Vecinos</h1>
        <hr />
        <div>
          <p>Alertar a TODOS los vecinos: <strong>Condominio Rosedal 1</strong></p>
          <button className="ui red button">Alertar</button>
          <button className="ui red button">Foto</button>
        </div>
        <div>
          <img id="casa-imagen" src="/img/casa-imagen.png" />

          <h3>Líder</h3>
          <h3>8583 - 7647</h3>

          <img id="badge-lider" src="/img/lider.png" />

          <h2>Familia Rodríguez</h2>

          <button className="ui orange basic button"><img src="/img/editar.png" /></button>


          <button className="ui orange button">Alertar</button>
          <button className="ui orange button">Foto</button>
        </div>

        <div>
        <button className="ui orange button">+ Agregar Mi Casa</button>
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
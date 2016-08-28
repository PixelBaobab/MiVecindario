import React from 'react';

export default class InviteNeighbors extends React.Component {
  render() {
    return(
      <div>
     	  <h1>Invitar Vecinos</h1>
        <hr />
        <div>
        
          <button className="ui orange basic button"><img src="/img/agregar.png"/>Invitar Vecino</button>
          
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
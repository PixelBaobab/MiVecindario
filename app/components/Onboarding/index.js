import React from 'react';
import Hammer from 'react-hammerjs';
import _ from 'lodash';

const slide_letters = ['a', 'b', 'c'];

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);

    this.state = {
      currentSlide: 0,
      slideWidth: 0
    }
  }

  componentDidMount() {
    let ob = this.refs.onboarding;
    console.log(ob);

    this.setState({
      slideWidth: ob.offsetWidth
    });
  }

  handleSwipe(ev){
    console.log(ev);

    if (ev.deltaX < 0){
      if (this.state.currentSlide < slide_letters.length - 1) this.setState({ currentSlide: this.state.currentSlide + 1 });
    } else {
      if (this.state.currentSlide > 0) this.setState({ currentSlide: this.state.currentSlide - 1 });
    }
  }

  render() {
    let slidesClasses = ['slides'];
    slidesClasses.push('slide-' + slide_letters[this.state.currentSlide]);

    let slideWidthStyle = { width: this.state.slideWidth + 'px' };

    return(
      <Hammer className="onboarding" onSwipe={this.handleSwipe}>
        <div>
          <div className="onboarding" ref="onboarding">
            <div className={slidesClasses.join(' ')}>
              <div className="slide" style={slideWidthStyle}>
                <h1>¡Bienvenido!</h1>
                <p>Bienvenido a MiVecindario, conéctese con sus vecinos sin compartir su información privada como lo es su número telefónico o email.</p>
              </div>
              <div className="slide" style={slideWidthStyle}>
                <h1>Alertas</h1>
                <p>Alerte a su vecino ó a su vecindario mediante mensaje de texto ó email.</p>
              </div>
              <div className="slide" style={slideWidthStyle}>
                <h1>Organice</h1>
                <p>Los líderes de cada vecindario puede organizar a los vecinos mediante roles dentro de la comunidad.</p>
              </div>
            </div>
          </div>
        </div>
      </Hammer>
    );
  }
}
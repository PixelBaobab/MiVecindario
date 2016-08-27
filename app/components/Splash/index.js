import React from 'react';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    }
  }

  componentDidMount() {
    let self = this;
    setTimeout(function(){
      self.setState(
        {
          visible: false
        }
      );
    }, 1000);
  }

  render() {
    let classes = [];
    if (!this.state.visible) classes.push('no-display');

    return(
      <img id="splash" className={classes.join(' ')} src="/img/splash.png" />
    );
  }
}
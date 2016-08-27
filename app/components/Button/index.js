import React from 'react';

export default class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.processClick = this.processClick.bind(this);
    this.handleDone = this.handleDone.bind(this);

    this.state = {
      loading: false,
    };
  }

  handleClick() {
    if (!this.props.disabled && this.state.loading === false) {
      this.setState(
        {
          loading: true,
          startTime: (new Date()).getTime(),
        },
        this.processClick
      );
    }
  }

  processClick() {
    this.props.onClick(this.handleDone);
  }

  handleDone() {
    this.setState(
      {
        loading: false
      }
    );
  }

  render() {
    let classes = [];
    if (this.props.disabled) classes.push('disabled');
    if (this.state.loading) classes.push('loading');

    return(
      <button className={['ui', classes.join(' '), 'button'].join(' ')} onClick={this.handleClick}>{this.props.children}</button>
    );
  }
}
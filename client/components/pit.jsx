import React from 'react';

export default class Pit extends React.Component {
  render() {
    return <div className="pit" data-pit-num={this.props.pitNum}>{this.props.pieces}</div>;
  }
}

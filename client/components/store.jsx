import React from 'react';

export default class Store extends React.Component {
  render() {
    return <div className="store" data-pit-num={this.props.pitNum}>{this.props.pieces}</div>;
  }
}

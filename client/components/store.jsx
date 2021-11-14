import React from 'react';

export default class Store extends React.Component {
  render() {
    return <div className="store">{this.props.pieces}</div>;
  }
}

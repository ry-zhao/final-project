import React from 'react';

export default class Piece extends React.Component {
  render() {
    const { x, y, gradient } = this.props;
    const style = {
      top: `${y * 80}%`,
      left: `${x * 75}%`,
      background: `linear-gradient(#${gradient[0]}, #${gradient[1]})`
    };
    return <div className="piece" style={style}></div>;
  }
}

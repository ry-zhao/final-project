import React from 'react';

export default class Piece extends React.Component {
  render() {
    <div>hi</div>;
  }

  getRandomColor() {
    let color = (Math.floor(Math.random() * 16777215)).toString(16);
    while (color.length !== 6) {
      color = 0 + color;
    }
    return color;
  }

}

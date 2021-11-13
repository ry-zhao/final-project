import React from 'react';
import Pit from './pit';

export default class Board extends React.Component {
  render() {
    const pits = [];
    for (let i = 0; i < 12; i++) {
      const piece = <div>hi</div>;
      const pit = <Pit piece={piece} pitNum={i}/>;
      pits.push(pit);
    }

    return (
      <div className="board">
        <div className="board-row">
          <div className="store"></div>
        </div>
        <div className="board-row">
          {pits[6]}
          {pits[5]}
        </div>
        <div className="board-row">
          {pits[7]}
          {pits[4]}
        </div>
        <div className="board-row">
          {pits[8]}
          {pits[3]}
        </div>
        <div className="board-row">
          {pits[9]}
          {pits[2]}
        </div>
        <div className="board-row">
          {pits[10]}
          {pits[1]}
        </div>
        <div className="board-row">
          {pits[11]}
          {pits[0]}
        </div>
        <div className="board-row">
          <div className="store"></div>
        </div>
      </div>
    );
  }
}

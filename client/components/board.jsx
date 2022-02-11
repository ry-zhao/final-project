import React from 'react';
import Pit from './pit';
import Store from './store';
import Piece from './piece';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyMoving: false,
      currentPit: null,
      destination: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const pits = [];
    const { room } = this.props;
    if (room) {
      const pieces = room.pitValues.map((pit, i) => pit.map(piece => <Piece key={piece.key}
        x={piece.x} y={piece.y} gradient={piece.gradient} pitNum={i} />));
      for (let i = 0; i < 14; i++) {
        let pit;
        if (i === 6 || i === 13) {
          pit = <Store pieces={pieces[i]} pitNum = {i} />;
        } else {
          pit = <Pit pieces={pieces[i]} pitNum = {i} />;
        }
        pits.push(pit);
      }
    }

    return (
      <div className="board" onClick={this.handleClick}>
        <div className="board-row">
          {pits[6]}
        </div>
        <div className="board-row">
          {pits[7]}
          {pits[5]}
        </div>
        <div className="board-row">
          {pits[8]}
          {pits[4]}
        </div>
        <div className="board-row">
          {pits[9]}
          {pits[3]}
        </div>
        <div className="board-row">
          {pits[10]}
          {pits[2]}
        </div>
        <div className="board-row">
          {pits[11]}
          {pits[1]}
        </div>
        <div className="board-row">
          {pits[12]}
          {pits[0]}
        </div>
        <div className="board-row">
          {pits[13]}
        </div>
      </div>
    );
  }

  handleClick(event) {
    if (event.target.className !== 'pit' && event.target.className !== 'piece') {
      return;
    }
    let currentPit;
    if (event.target.className === 'pit') {
      currentPit = Number(event.target.getAttribute('data-pit-num'));
    } else {
      currentPit = Number(event.target.closest('.pit').getAttribute('data-pit-num'));
    }
    const { roomId } = this.props.room;
    const { screenName } = this.props;

    fetch(
      `/api/turn/currentPit/${currentPit}/roomId/${roomId}/screenName/${screenName}`,
      { method: 'POST' }
    )
      .then(res => { this.props.updateWaiting(false); })
      .catch(err => {
        console.error(err);
        this.props.updateError();
      });
    this.props.updateWaiting(true);
  }
}

import React from 'react';

export default class Room extends React.Component {
  render() {
    return (
      <div className="board-container">
        <div className="board">
          <div className="board-row">
            <div className="store"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="pit"></div>
            <div className="pit"></div>
          </div>
          <div className="board-row">
            <div className="store"></div>
          </div>
        </div>
      </div>
    );
  }
}

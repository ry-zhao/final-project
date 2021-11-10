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

        <div className="board-dt">
          <div className="store-col">
            <div className="store-dt"></div>
          </div>
          <div className="pits-col">
            <div className="board-row-dt">
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>

            </div>
            <div className="board-row-dt">
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
              <div className="pit-container-dt">
                <div className="pit-dt"></div>
              </div>
            </div>
          </div>
          <div className="store-col">
            <div className="store-dt"></div>
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';

export default class DesktopBoard extends React.Component {
  render() {
    return (
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
    );
  }
}

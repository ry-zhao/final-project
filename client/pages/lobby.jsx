import React from 'react';
import { AppContext } from '../lib';

export default class Lobby extends React.Component {
  render() {
    const rooms = this.props.rooms.map(room => (
      <div className="row" key={room.roomId}>
        <div className="col s12">
          <div className="card white room-card">
            <div className="card-content black-text">
              <span className="card-title">{room.roomName}</span>
            </div>
            <div className="card-action text-align-right">
              <a className="waves-effect waves-light btn custom bg-columbia-blue margin-right-1rem" href="#lobby">View</a>
              <a className="waves-effect waves-green btn custom bg-tea-green" href="#lobby">Join</a>
            </div>
          </div>
        </div>
      </div>
    ));
    return (<div className="room-container margin-auto width-50-percent-dt">{rooms}</div>);
  }
}

Lobby.contextType = AppContext;

import React from 'react';
import Board from '../components/board';
import DesktopBoard from '../components/desktop-board';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      room: null
    };
  }

  componentDidMount() {
    const roomId = this.props.route.params.get('roomId');
    const { socket } = this.state;

    fetch(`api/joinroom/${roomId}/user/${this.props.screenName}`)
      .then(response => {
        if (response.status !== 200) {
          window.location.hash = '#lobby';
          return;
        }
        response.json()
          .then(room => this.setState(prevState => ({ room })))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));

    socket.on('room update', room => {
      this.setState(prevState => ({ room }));
    });
  }

  componentWillUnmount() {
    const { socket } = this.state;
    socket.off('room update');
  }

  render() {
    const { room } = this.state;

    return (
      <>
      <header>
          <nav>
            <div className="nav-wrapper bg-columbia-blue">
              <div className="row bright-gray">
                <div className="col s4 center-align">
                  <h6 className="margin-top-1p25rem">
                    {this.getPlayer()}
                  </h6>
                </div>
                <div className="col s4 center-align">
                  <h6 className="margin-top-1p25rem">
                    {this.getRoomName()}
                  </h6>
                </div>
                <div className="col s4 center-align">
                  <h6>
                    {this.getScore()}
                  </h6>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="bg-light-gray">
          <div className="board-container">
          <Board room={room} socket={this.props.socket}/>
          <DesktopBoard/>
          </div>
      </main>
        <footer className="page-footer height-4rem bg-columbia-blue">
          <div className="container height-2p5rem">
            <div className="row">
              {/* {footerContent} */}
            </div>
          </div>
        </footer>
        </>
    );
  }

  getRoomName() {
    if (!this.state.room) {
      return 'Room';
    } else {
      return this.state.room.roomName;
    }
  }

  getPlayer() {
    if (!this.state.room) {
      return '';
    } else {
      if (this.state.room.activePlayer === 1) {
        return `Player 1: ${this.state.room.playerOne}`;
      } else {
        return `Player 2: ${this.state.room.playerTwo}`;
      }
    }
  }

  getScore() {
    if (!this.state.room) {
      return '';
    } else if (this.state.room.gameStarted) {
      return `${this.state.room.pitValues[6].length} - ${this.state.room.pitValues[13].length}`;
    }
  }
}

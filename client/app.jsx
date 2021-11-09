import React from 'react';
import Home from './pages/home';
import Lobby from './pages/lobby';
import { io } from 'socket.io-client';
import { parseRoute, AppContext } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      nameRejected: false,
      screenName: '',
      route: parseRoute(window.location.hash),
      socket: null,
      rooms: [],
      newRoomModal: false,
      roomInput: ''
    };
    this.updateScreenName = this.updateScreenName.bind(this);
    this.sendName = this.sendName.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
    this.openNewRoomModal = this.openNewRoomModal.bind(this);
    this.updateRoomInput = this.updateRoomInput.bind(this);
    this.requestRoom = this.requestRoom.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.updateRoute);
  }

  render() {
    let overlay = '';
    let loginError = '';
    let view = '';
    if (this.state.nameRejected) {
      loginError = `${this.state.screenName} is already in use!`;
    }
    if (!this.state.signedIn) {
      overlay = (
        <div className="overlay">

          <div className="custom-modal">
            <h5>Welcome to LibreKalah</h5>
            <form onSubmit={this.sendName}>
              <div className="row">
                <div className="input-field custom col s12">
                  <input id="screen-name" type="text" onChange={this.updateScreenName} value={this.state.screenName}/>
                  <label htmlFor="screen-name">Screen Name</label>
                </div>
              </div>
              <h6 className="red-text-only">{loginError}</h6>
              <div className="flex justify-content-center">
                <a className="waves-effect waves-green btn custom bg-tea-green absolute center bottom-1rem" onClick={this.sendName}>Enter</a>
              </div>
            </form>
          </div>

        </div>
      );
    }

    if (this.state.newRoomModal) {
      overlay = (
        <div className="overlay">
          <div className="custom-modal">
            <h5>Create a New Room</h5>
            <form onSubmit={this.requestRoom}>
              <div className="row">
                <div className="input-field custom col s12">
                  <input id="room-name" type="text" onChange={this.updateRoomInput} value={this.state.roomName}/>
                  <label htmlFor="room-name">Room Name</label>
                </div>
              </div>
              <h6 className="red-text-only">{loginError}</h6>
              <div className="flex justify-content-center">
                <a className="waves-effect waves-green btn custom bg-tea-green absolute center bottom-1rem" onClick={this.requestRoom}>Enter</a>
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (this.state.route.path === 'lobby') {
      const { socket } = this.state;
      const contextValue = { socket };
      view = (
        <AppContext.Provider value={contextValue}>
          <Lobby rooms={this.state.rooms}/>
        </AppContext.Provider>
      );
    } else {
      view = <Home/>;
    }

    return (
      <>
        <header>
          <nav>
            <div className="nav-wrapper bg-columbia-blue">
              <a href="#" className="brand-logo center bright-gray">Rooms</a>
            </div>
          </nav>
        </header>
        {overlay}
        <main>
          {view}
        </main>
        <footer className="page-footer height-4rem bg-columbia-blue">
          <div className="container height-2p5rem">
            <div className="row">
              <a
              className="btn-floating btn-large waves-effect waves-light custom"
                onClick={this.openNewRoomModal}><i className="material-icons">add</i></a>
            </div>
          </div>
        </footer>
      </>
    );

  }

  updateScreenName(event) {
    this.setState(prevState => ({
      screenName: event.target.value,
      nameRejected: false
    }));
  }

  updateRoute(event) {
    this.setState(prevState => ({ route: parseRoute(window.location.hash) }));
  }

  sendName(event) {
    event.preventDefault();
    fetch('api/entername', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screenName: this.state.screenName })
    })
      .then(result => {
        if (result.status === 200) {
          const socket = io('', { query: { screenName: this.state.screenName } });
          socket.on('room update', data => {
            const rooms = data.filter(room => room !== null);
            this.setState(prevState => ({
              rooms
            }));
          });
          window.location.hash = '#lobby';
          this.setState(prevState => ({
            signedIn: true,
            nameRejected: false,
            socket
          }));
          fetch('/api/rooms')
            .then(result => result.json())
            .then(rooms => rooms.filter(room => room !== null))
            .then(rooms => this.setState(prevState => ({ rooms })))
            .catch(err => console.error(err));
        } else {
          this.setState(prevState => ({ nameRejected: true }));
        }
      })
      .catch(err => console.error(err));
  }

  openNewRoomModal(event) {
    this.setState(prevState => ({
      newRoomModal: true
    }));
  }

  updateRoomInput(event) {
    const roomInput = event.target.value;
    this.setState(prevState => ({
      roomInput
    }));
  }

  requestRoom(event) {
    event.preventDefault();
    fetch('/api/newroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: this.state.roomInput })
    })
      .then(() => {
        this.setState(prevState => ({
          newRoomModal: false
        }));
      })
      .catch(err => console.error(err));
  }
}

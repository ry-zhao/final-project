import React from 'react';
import Home from './pages/home';
import Lobby from './pages/lobby';
import Room from './pages/room';
import { io } from 'socket.io-client';
import { parseRoute, AppContext } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameRejected: false,
      screenName: '',
      route: parseRoute(window.location.hash),
      socket: null,
      rooms: [],
      modal: 'login',
      roomInput: '',
      currentRoom: null,
      selectedRoom: 0
    };
    this.updateScreenName = this.updateScreenName.bind(this);
    this.sendName = this.sendName.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
    this.openNewRoomModal = this.openNewRoomModal.bind(this);
    this.updateRoomInput = this.updateRoomInput.bind(this);
    this.requestRoom = this.requestRoom.bind(this);
    this.openConfirmationModal = this.openConfirmationModal.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.updateRoute);
  }

  render() {
    let headerContent = '';
    let overlay = '';
    let loginError = '';
    let footerContent = '';
    let view = '';
    if (this.state.nameRejected) {
      loginError = `${this.state.screenName} is already in use!`;
    }

    if (this.state.modal) {
      if (this.state.modal === 'login') {
        overlay = (
          <div className="overlay">

            <div className="custom-modal">
              <h5>Welcome to LibreKalah</h5>
              <form onSubmit={this.sendName}>
                <div className="row">
                  <div className="input-field custom col s12">
                    <input id="screen-name" type="text" onChange={this.updateScreenName} value={this.state.screenName} />
                    <label htmlFor="screen-name">Screen Name</label>
                  </div>
                </div>
                <h6 className="red-text-only">{loginError}</h6>
                  <a className="waves-effect waves-green btn custom bg-tea-green absolute center bottom-1rem" onClick={this.sendName}>Enter</a>
              </form>
            </div>

          </div>
        );
      } else if (this.state.modal === 'new room') {
        overlay = (
          <div className="overlay">
            <div className="custom-modal">
              <h5>Create a New Room</h5>
              <form onSubmit={this.requestRoom}>
                <div className="row">
                  <div className="input-field custom col s12">
                    <input id="room-name" type="text" onChange={this.updateRoomInput} value={this.state.roomInput} />
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
      } else if (this.state.modal === 'confirmation') {
        overlay = (
        <div className="overlay">
            <div className="confirmation-modal">
              <h5>Join {this.getRoom(this.state.selectedRoom).roomName}?</h5>
              <div className="flex justify-content-space-between margin-top-3p5rem padding-lr-1rem">
                <a className="waves-effect waves-light btn custom bg-columbia-blue" onClick={this.closeModal}>Cancel</a>
                <a className="waves-effect waves-green btn custom bg-tea-green" onClick={this.joinRoom}>Confirm</a>
              </div>
            </div>
        </div>
        );
      }
    }

    if (this.state.route.path === 'lobby') {
      const { socket } = this.state;
      const contextValue = { socket };
      headerContent = (
        <a href="#" className="brand-logo center bright-gray">Rooms</a>
      );
      view = (
        <AppContext.Provider value={contextValue}>
          <Lobby rooms={this.state.rooms} openConfirmationModal={this.openConfirmationModal}/>
        </AppContext.Provider>
      );
      footerContent = (<a
        className="btn-floating btn-large waves-effect waves-light custom"
        onClick={this.openNewRoomModal}><i className="material-icons">add</i></a>);
    } else if (this.state.route.path === 'room') {
      headerContent = (
        <div className="row bright-gray">
          <div className="col s4 center-align">
            <h6 className="margin-top-1p25rem">
              Player 1: {this.state.screenName}
            </h6>
          </div>
          <div className="col s4 center-align">
            <h6 className="margin-top-1p25rem">
              {this.getRoom(this.state.selectedRoom).roomName}
            </h6>
          </div>
          <div className="col s4 center-align">
            <h5>
              0 - 0
            </h5>
          </div>
        </div>
      );
      view = <Room room={this.getRoom(this.state.selectedRoom)} />;
    } else {
      view = <Home/>;
    }

    return (
      <>
        <header>
          <nav>
            <div className="nav-wrapper bg-columbia-blue">
              {headerContent}
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
              {footerContent}
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
            modal: null,
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
      modal: 'new room'
    }));
  }

  openConfirmationModal(event) {
    if (event.target.textContent !== 'Join') {
      return;
    }
    this.setState(prevState => ({
      modal: 'confirmation',
      selectedRoom: Number(event.target.getAttribute('data-room-id'))
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
          modal: null,
          roomInput: ''
        }));
      })
      .catch(err => console.error(err));
  }

  joinRoom(event) {
    event.preventDefault();
    fetch(`api/joinroom/${this.state.selectedRoom}/user/${this.state.screenName}`)
      .then(response => {
        if (response.status === 200) {
          window.location.hash = '#room';
          this.setState(prevState => ({
            modal: null,
            route: parseRoute(window.location.hash)
          }));
        }
      })
      .catch(err => console.error(err));
  }

  getRoom(roomId) {
    const room = this.state.rooms.find(room => room.roomId === roomId);
    return room;
  }

  closeModal(event) {
    this.setState(prevState => ({
      modal: null
    }));
  }
}

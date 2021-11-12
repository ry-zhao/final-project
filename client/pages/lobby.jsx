import React from 'react';
import NewRoomModal from './new-room-modal';
import ConfirmationModal from './confirmation-modal';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      rooms: [],
      selectedRoom: null
    };
    this.openNewRoomModal = this.openNewRoomModal.bind(this);
    this.openConfirmationModal = this.openConfirmationModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestRoom = this.requestRoom.bind(this);
    this.getRoom = this.getRoom.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('room update', data => {
      const rooms = data.filter(room => room !== null);
      this.setState(prevState => ({
        rooms
      }));
    });
    fetch('/api/rooms')
      .then(result => result.json())
      .then(rooms => rooms.filter(room => room !== null))
      .then(rooms => this.setState(prevState => ({ rooms })))
      .catch(err => console.error(err));
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off('room update');
  }

  render() {
    let modal;

    if (this.state.modal === 'new room') {
      modal = <NewRoomModal requestRoom={this.requestRoom}/>;
    } else if (this.state.modal === 'confirmation') {
      modal = <ConfirmationModal selectedRoom={this.state.selectedRoom} closeModal={this.closeModal}/>;
    }

    const rooms = this.state.rooms.map(room => (
      <div className="row" key={room.roomId}>
        <div className="col s12">
          <div className="card white room-card">
            <div className="card-content bright-gray">
              <span className="card-title">{room.roomName} - {room.players}/2</span>
            </div>
            <div className="card-action text-align-right">
              <a className="waves-effect waves-light btn custom bg-columbia-blue margin-right-1rem" href="#lobby">View</a>
              <a className="waves-effect waves-green btn custom bg-tea-green join-button" data-room-id={room.roomId} href="#lobby">Join</a>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <>
        {modal}
        <header>
          <nav>
            <div className="nav-wrapper bg-columbia-blue">
              <a href="#" className="brand-logo center bright-gray">Rooms</a>
            </div>
          </nav>
        </header>

        <main>
          <div className="room-container margin-auto width-50-percent-dt" onClick={this.openConfirmationModal}>{rooms}</div>
        </main>

        <footer className="page-footer height-4rem bg-columbia-blue">
          <div className="container height-2p5rem">
            <div className="row">
              <a className="btn-floating btn-large waves-effect waves-light custom"
                onClick={this.openNewRoomModal}>
                  <i className="material-icons">add</i>
              </a>
            </div>
          </div>
        </footer>
      </>
    );
  }

  openNewRoomModal(event) {
    this.setState(prevState => ({ modal: 'new room' }));
  }

  openConfirmationModal(event) {
    if (event.target.textContent !== 'Join') {
      return;
    }
    const selectedRoom = this.getRoom(Number(event.target.getAttribute('data-room-id')));
    this.setState(prevState => ({ modal: 'confirmation', selectedRoom }));
  }

  closeModal(event) {
    this.setState(prevState => ({ modal: null }));
  }

  requestRoom(roomName) {
    event.preventDefault();
    fetch('/api/newroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName })
    })
      .then(() => {
        this.closeModal();
      })
      .catch(err => console.error(err));
  }

  getRoom(roomId) {
    const room = this.state.rooms.find(room => room.roomId === roomId);
    return room;
  }
}

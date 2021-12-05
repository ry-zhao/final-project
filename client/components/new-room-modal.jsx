import React from 'react';
import Spinner from './spinner';

export default class NewRoomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomInput: '',
      waiting: false
    };
    this.updateRoomInput = this.updateRoomInput.bind(this);
  }

  render() {
    let spinner;
    if (this.state.waiting) {
      spinner = <Spinner />;
    }
    return (
      <div className="overlay">
        <div className="custom-modal">
          <h5>Create a New Room</h5>
          <form onSubmit={() => this.props.requestRoom(this.state.roomInput)}>
            <div className="row">
              <div className="input-field custom col s12">
                <input id="room-name" type="text" onChange={this.updateRoomInput} value={this.state.roomInput} />
                <label htmlFor="room-name">Room Name</label>
              </div>
            </div>
            <div className="flex justify-content-center">
              <h6 className="relative bottom-1rem">{spinner}</h6>
              <a className="waves-effect waves-green btn custom bg-tea-green absolute center bottom-1rem"
                onClick={() => { this.setState(prevState => ({ waiting: true })); this.props.requestRoom(this.state.roomInput); }}>
                Enter
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  updateRoomInput(event) {
    const roomInput = event.target.value;
    this.setState(prevState => ({ roomInput }));
  }
}

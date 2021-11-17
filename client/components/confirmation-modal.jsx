import React from 'react';

export default class ConfirmationModal extends React.Component {
  render() {
    return (
      <div className="overlay">
        <div className="confirmation-modal">
          <h5>Join {this.props.selectedRoom.roomName}?</h5>
          <div className="flex justify-content-space-between margin-top-3p5rem padding-lr-1rem">
            <a className="waves-effect waves-light btn custom bg-columbia-blue" onClick={this.props.closeModal}>Cancel</a>
            <a className="waves-effect waves-green btn custom bg-tea-green" onClick={this.props.joinRoom}>Confirm</a>
          </div>
        </div>
      </div>
    );
  }
}

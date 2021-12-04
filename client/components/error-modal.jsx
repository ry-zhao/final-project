import React from 'react';

export default class ErrorModal extends React.Component {
  render() {
    return (
      <div className="overlay">
        <div className="custom-modal">
          <h5>Network Error: Please check your connection.</h5>
        </div>
      </div>
    );
  }
}

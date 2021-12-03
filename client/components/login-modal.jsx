import React from 'react';
import Spinner from './spinner';

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenNameInput: '',
      screenNameRejected: false,
      waiting: false
    };
    this.updateScreenNameInput = this.updateScreenNameInput.bind(this);
    this.sendName = this.sendName.bind(this);
  }

  render() {
    let loginError;
    let spinner;
    if (this.state.waiting) {
      spinner = <Spinner />;
    }
    if (this.state.screenNameRejected) {
      loginError = `${this.state.screenNameInput} is already in use!`;
    }
    return (
      <div className="overlay">
        <div className="custom-modal">
          <h5>Welcome to Kalah.io</h5>
          <form onSubmit={this.sendName}>
            <div className="row">
              <div className="input-field custom col s12">
                <input id="screen-name" type="text" onChange={this.updateScreenNameInput} value={this.state.screenNameInput} />
                <label htmlFor="screen-name">Screen Name</label>
              </div>
            </div>
            <h6 className="relative bottom-1rem">{spinner}</h6>
            <h6 className="red-text-only">{loginError}</h6>
            <a className="waves-effect waves-green btn custom bg-tea-green absolute center bottom-1rem" onClick={this.sendName}>Enter</a>
          </form>
        </div>
      </div>
    );
  }

  updateScreenNameInput(event) {
    this.setState(prevState => ({
      screenNameInput: event.target.value,
      screenNameRejected: false
    }));
  }

  sendName(event) {
    event.preventDefault();
    this.setState(prevState => ({ waiting: true }));
    fetch('/api/entername', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screenName: this.state.screenNameInput })
    })
      .then(result => {
        if (result.status === 200) {
          this.props.updateScreenName(this.state.screenNameInput);
        } else {
          this.setState(prevState => ({
            waiting: false,
            screenNameRejected: true
          }));
        }
      })
      .catch(err => console.error(err));
  }
}

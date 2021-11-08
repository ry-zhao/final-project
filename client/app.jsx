import React from 'react';
import Home from './pages/home';
import { io } from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      nameRejected: false,
      screenName: ''
    };
    this.updateScreenName = this.updateScreenName.bind(this);
    this.sendName = this.sendName.bind(this);
  }

  render() {
    let loginOverlay = '';
    let loginError = '';
    if (this.state.nameRejected) {
      loginError = `${this.state.screenName} is already in use!`;
    }
    if (!this.state.signedIn) {
      loginOverlay = (
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

    return (
      <>
        <header>
          <nav>
            <div className="nav-wrapper bg-columbia-blue">
              <a href="#" className="brand-logo center bright-gray">Rooms</a>
            </div>
          </nav>
        </header>
        {loginOverlay}
        <main>
          <Home/>
        </main>
        <footer className="page-footer height-4rem bg-columbia-blue">
          <div className="container">
            <div className="row">
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

  sendName(event) {
    event.preventDefault();
    fetch('/entername', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screenName: this.state.screenName })
    })
      .then(result => {
        if (result.status === 200) {
          io('', { query: { screenName: this.state.screenName } });
          this.setState(prevState => ({
            signedIn: true,
            nameRejected: false
          }));
        } else {
          this.setState(prevState => ({
            nameRejected: true
          }));
        }
      });
  }
}

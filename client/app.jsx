import React from 'react';
import Home from './pages/home';
import LoginModal from './pages/login-modal';
import Lobby from './pages/lobby';
import Room from './pages/room';
import { io } from 'socket.io-client';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      screenName: '',
      socket: null
    };
    this.updateScreenName = this.updateScreenName.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.updateRoute);
  }

  render() {
    let login;
    let view;
    const { path } = this.state.route;

    if (!this.state.socket) {
      login = <LoginModal updateScreenName={this.updateScreenName}/>;
      view = <h1>Welcome</h1>;
    } else if (!path) {
      view = <Home />;
    } else {
      if (path === 'lobby') {
        view = <Lobby socket={this.state.socket} screenName={this.state.screenName}/>;
      } else if (path === 'room') {
        view = <Room socket={this.state.socket} screenName={this.state.screenName} route={this.state.route}/>;
      }
    }

    return (
      <>
      {login}
      {view}
      </>
    );
  }

  updateScreenName(screenName) {
    const socket = io('', { query: { screenName } });
    window.location.hash = '#lobby';
    this.setState(prevState => ({
      screenName,
      socket
    }));
  }

  updateRoute(event) {
    const route = parseRoute(window.location.hash);
    this.setState(prevState => ({ route }));
  }
}

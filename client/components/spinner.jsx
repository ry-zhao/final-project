import React from 'react';

export default class Spinner extends React.component {
  render() {
    return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
  }
}

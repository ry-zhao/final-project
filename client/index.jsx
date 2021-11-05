import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

// ReactDOM.render(
//   <>
//     <nav>
//       <div className="nav-wrapper bg-columbia-blue">
//         <a href="#" className="brand-logo center bright-gray">Rooms</a>
//       </div>
//     </nav>
//   </>,
//   document.querySelector('header')
// );

// ReactDOM.render(
//   <>
//     <div className="container">
//       <div className="row">
//       </div>
//     </div>
//   </>,
//   document.querySelector('footer')
// );

ReactDOM.render(
  <>
    <App />
  </>,
  document.querySelector('#root')
);

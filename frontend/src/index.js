import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/store';
import ModalProvider from './context/Modal';
import sessionActions from './store/session'
import songActions from './store/songs'
import jwtFetch from './store/jwt'

let store = configureStore({});

// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
//   window.jwtFetch = jwtFetch;
//   window.sessionActions = sessionActions;
//   window.userActions = userActions;
//   window.songActions = songactions
// }

function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);





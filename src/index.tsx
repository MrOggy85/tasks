import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import onStartup from './core/onStartup';
import store from './core/redux/store';

const container = document.getElementById('root');
if (!container) {
  throw new Error('No elementwith #root found');
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
);

onStartup();

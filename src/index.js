import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style/application.scss';

const $ = require('jquery');
global.jQuery = require("jquery");
window.$ = $;
const bootstrap = require('bootstrap');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

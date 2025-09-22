'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_2 = require('react');
const client_2 = require('react-dom/client');
require('./index.css');
const App_tsx_1 = require('./App.tsx');
(0, client_2.createRoot)(document.getElementById('root')).render(
  <react_2.StrictMode>
    <App_tsx_1.default />
  </react_2.StrictMode>
);

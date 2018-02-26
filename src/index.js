import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './Router';
// import 'bootstrap/dist/css/bootstrap.css'

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();

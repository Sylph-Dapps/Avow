import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Avow from './Avow';

ReactDOM.render(
  <Router>
    <Avow />
  </Router>, document.getElementById('root'));

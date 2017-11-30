import React from 'react';
import ReactDOM from 'react-dom';
import NoCMSClient from './NoCMSClient.jsx';

let templates = [];

export default {
  setTemplates(tmpl) {
    templates = tmpl;
    return this;
  },
  render() {
    ReactDOM.render(<NoCMSClient templates={templates} />, document.getElementById('mainContent'));
    return this;
  },
};

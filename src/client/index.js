import React from 'react';
import ReactDOM from 'react-dom';
import NoCMSClient from './NoCMSClient';

let templates = [];

const api = {
  setTemplates(tmpl) {
    templates = tmpl;
    return this;
  },
  render() {
    ReactDOM.render(<NoCMSClient templates={templates} />, document.getElementById('mainContent'));
    return this;
  },
};

export default api;

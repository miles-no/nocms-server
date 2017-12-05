import React from 'react';
import ReactDOM from 'react-dom';
import { AdminContent } from 'nocms-publishing';

let templates = [];
let sections = [];
let languages = [];

const api = {
  setTemplates(tmpl) {
    templates = tmpl;
    return this;
  },
  setSections(sect) {
    sections = sect;
    return this;
  },
  setLanguages(lang) {
    languages = lang;
    return this;
  },
  render() {
    ReactDOM.render(
      <AdminContent
        templates={templates}
        sections={sections}
        languages={languages}
      />, document.getElementById('adminPanel'));
    return this;
  },
};

export default api;

import React from 'react';
import ReactDOM from 'react-dom';
import { AdminContent } from 'nocms-publishing';

let templates = [];
let sections = [];
let languages = [];
let folders = [];
let applications = [];

const api = {
  setTemplates(tmpl) {
    templates = tmpl;
    return this;
  },
  setSections(sect) {
    sections = sect;
    return this;
  },
  setFolders(fold) {
    folders = fold;
    return this;
  },
  setLanguages(lang) {
    languages = lang;
    return this;
  },
  setApplications(apps) {
    applications = apps;
    return this;
  },
  render() {
    ReactDOM.render(
      <AdminContent
        templates={templates}
        sections={sections}
        languages={languages}
        folders={folders}
        applications={applications}
      />, document.getElementById('adminPanel'));
    return this;
  },
};

export default api;

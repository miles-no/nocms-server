import React from 'react';
import ReactDOM from 'react-dom';
import { AdminContent } from 'nocms-publishing'; // eslint-disable-line

let templates = [];
let sections = [];
let languages = [];
let folders = [];
let applications = [];
let pageListFilters = [];

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
  setPageListFilters(filters) {
    pageListFilters = filters;
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
        pageListFilters={pageListFilters}
      />, document.getElementById('adminPanel'));
    return this;
  },
};

export default api;

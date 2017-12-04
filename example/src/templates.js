import React from 'react';

export default [
  {
    id: 'example',
    component: <div><h1>Hello NoCMS!</h1><h2>{this.props.pageData.title}</h2></div>,
    name: {
      no: 'Eksempel',
      en: 'Example',
    },
    siteTemplate: true,
    sections: [],
  },
];
